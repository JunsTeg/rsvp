import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rsvpRouter from './routes/rsvp'
import adminRouter from './routes/admin'

const app = express()
const PORT = Number(process.env.PORT) || 3001
app.set('trust proxy', 1)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
)

app.use(morgan('dev'))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

app.use('/api/rsvp', rsvpRouter)
app.use('/api/admin', adminRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() })
})

// Force ts-node-dev reload for port 3002
app.listen(PORT, () => {
  console.log(`SETECT RSVP API running on port ${PORT}`)
})

export default app
