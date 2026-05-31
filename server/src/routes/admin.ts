import { Router, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { z } from 'zod'
import * as XLSX from 'xlsx'
import prisma from '../utils/prisma'
import { requireAdmin } from '../middleware/auth'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives de connexion.' },
})

// POST /admin/login
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Données invalides' })
    return
  }

  const { username, password } = parsed.data

  try {
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) {
      res.status(401).json({ message: 'Identifiants incorrects' })
      return
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      res.status(401).json({ message: 'Identifiants incorrects' })
      return
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const token = await new SignJWT({ adminId: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .setIssuedAt()
      .sign(secret)

    res.json({ token, username: admin.username })
  } catch {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// GET /admin/rsvp — list with search/filter/pagination
router.get('/rsvp', requireAdmin, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 15))
  const search = String(req.query.search || '').trim()
  const statut = req.query.statut as string | undefined

  const where: Record<string, unknown> = {}

  if (statut && ['confirme', 'absent'].includes(statut)) {
    where.statut = statut
  }

  if (search) {
    where.OR = [
      { nom: { contains: search } },
      { prenom: { contains: search } },
      { email: { contains: search } },
      { telephone: { contains: search } },
      { entreprise: { contains: search } },
    ]
  }

  try {
    const [total, confirmes, absents, data] = await Promise.all([
      prisma.rsvp.count(),
      prisma.rsvp.count({ where: { statut: 'confirme' } }),
      prisma.rsvp.count({ where: { statut: 'absent' } }),
      prisma.rsvp.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const filtered = await prisma.rsvp.count({ where })

    res.json({
      data,
      stats: {
        total,
        confirmes,
        absents,
        taux: total > 0 ? Math.round((confirmes / total) * 100) : 0,
      },
      pagination: {
        page,
        limit,
        total: filtered,
        totalPages: Math.ceil(filtered / limit),
      },
    })
  } catch {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// DELETE /admin/rsvp/:id
router.delete('/rsvp/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.status(400).json({ message: 'ID invalide' })
    return
  }

  try {
    await prisma.rsvp.delete({ where: { id } })
    res.json({ message: 'Supprimé' })
  } catch {
    res.status(404).json({ message: 'Entrée non trouvée' })
  }
})

// GET /admin/export?format=xlsx|csv
router.get('/export', requireAdmin, async (req: Request, res: Response) => {
  const format = req.query.format === 'csv' ? 'csv' : 'xlsx'

  try {
    const data = await prisma.rsvp.findMany({ orderBy: { createdAt: 'desc' } })

    const rows = data.map(r => ({
      Nom: r.nom,
      Prénom: r.prenom,
      Entreprise: r.entreprise,
      Fonction: r.fonction,
      Email: r.email,
      Téléphone: r.telephone,
      Statut: r.statut === 'confirme' ? 'Confirmé' : 'Absent',
      'Date de réponse': new Date(r.createdAt).toLocaleString('fr-FR'),
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'RSVP')

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws)
      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', `attachment; filename="setect-rsvp-${Date.now()}.csv"`)
      res.send('﻿' + csv)
    } else {
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      res.setHeader('Content-Disposition', `attachment; filename="setect-rsvp-${Date.now()}.xlsx"`)
      res.send(buffer)
    }
  } catch {
    res.status(500).json({ message: 'Erreur export' })
  }
})

export default router
