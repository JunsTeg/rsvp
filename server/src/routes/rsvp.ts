import { Router, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import prisma from '../utils/prisma'
import { sendConfirmationEmail, sendAdminNotification } from '../utils/email'

const router = Router()

const rsvpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const rsvpSchema = z.object({
  nom: z.string().min(1, 'Nom requis').max(100).trim(),
  prenom: z.string().min(1, 'Prénom requis').max(100).trim(),
  entreprise: z.string().min(1, 'Entreprise requise').max(200).trim(),
  fonction: z.string().min(1, 'Fonction requise').max(200).trim(),
  email: z.string().email('Email invalide').max(200).toLowerCase().trim(),
  telephone: z.string().min(6, 'Téléphone requis').max(30).trim(),
  statut: z.enum(['confirme', 'absent']).optional(),
})

router.post('/', rsvpLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = rsvpSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        message: 'Données invalides',
        errors: parsed.error.flatten().fieldErrors,
      })
      return
    }

    const data = { ...parsed.data, statut: 'confirme' as const }

    const existing = await prisma.rsvp.findUnique({ where: { email: data.email } })
    if (existing) {
      res.status(409).json({ message: 'Cet email a déjà été enregistré.' })
      return
    }

    const rsvp = await prisma.rsvp.create({ data })

    // Send emails async (don't block response)
    Promise.all([
      sendConfirmationEmail(rsvp.email, {
        prenom: rsvp.prenom,
        nom: rsvp.nom,
        statut: rsvp.statut as 'confirme' | 'absent',
      }),
      sendAdminNotification({
        nom: rsvp.nom,
        prenom: rsvp.prenom,
        entreprise: rsvp.entreprise,
        email: rsvp.email,
        telephone: rsvp.telephone,
        statut: rsvp.statut as 'confirme' | 'absent',
      }),
    ]).catch(err => console.error('Email error:', err))

    res.status(201).json({ message: 'RSVP enregistré avec succès', id: rsvp.id })
  } catch (err) {
    console.error('RSVP error:', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

export default router
