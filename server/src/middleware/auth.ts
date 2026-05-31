import { Request, Response, NextFunction } from 'express'
import { jwtVerify } from 'jose'

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token manquant' })
    return
  }

  const token = auth.slice(7)
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    await jwtVerify(token, secret)
    next()
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' })
  }
}
