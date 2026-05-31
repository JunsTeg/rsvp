import nodemailer from 'nodemailer'

export function createTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').replace(/^:+/, '')

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function emailBase(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SETECT Event</title>
  <style>
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Inter', Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 0 auto; padding: 32px 16px; }
    .card { background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1E4D72 0%, #163a56 100%); padding: 32px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 1px; margin: 0; }
    .logo-sub { color: rgba(255,255,255,0.6); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
    .body { padding: 32px; }
    .pill { display: inline-block; background: #fff7ed; color: #F28F27; border: 1px solid #F28F27; border-radius: 99px; padding: 4px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
    h1 { color: #1E4D72; font-size: 22px; font-weight: 800; margin: 0 0 12px; }
    p { color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 16px; }
    .info-box { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #334155; }
    .info-row:last-child { margin-bottom: 0; }
    .icon { width: 20px; color: #39A5DE; font-weight: bold; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { font-size: 11px; color: #94a3b8; margin: 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #F28F27, #d4770f); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 8px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <p class="logo-text">SETECT</p>
        <p class="logo-sub">Secure and Protect Your Data</p>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} SETECT — Plateforme RSVP sécurisée</p>
        <p style="margin-top:4px;">marketing@setect.com · +237 6 95 39 03 29</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export async function sendConfirmationEmail(
  to: string,
  data: {
    prenom: string
    nom: string
    statut: 'confirme' | 'absent'
  },
) {
  const transporter = createTransporter()
  const isConfirme = data.statut === 'confirme'

  const content = isConfirme
    ? `
      <div class="pill">Confirmation de présence</div>
      <h1>Bonjour ${data.prenom} !</h1>
      <p>Votre participation à l'événement <strong>SETECT Exclusive Event</strong> a bien été confirmée.</p>
      <p>Nous sommes ravis de vous accueillir pour cette rencontre stratégique dédiée aux enjeux de Cyber Résilience en zone CEMAC.</p>
      <div class="info-box">
        <p style="font-weight:700;color:#1E4D72;margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Détails de l'événement</p>
        <div class="info-row"><span class="icon">📅</span> <strong>18 Juin 2026</strong></div>
        <div class="info-row"><span class="icon">🕒</span> <strong>15h00 – 21h00</strong></div>
        <div class="info-row"><span class="icon">📍</span> <strong>Elite Offices, Akwa – Douala</strong></div>
      </div>
      <p>Au programme : Mot de bienvenue du CEO · Panels de discussion · Keynote · Dîner & Networking.</p>
      <p style="font-size:12px;color:#94a3b8;">Pour toute question, contactez-nous à <a href="mailto:marketing@setect.com" style="color:#1E4D72;">marketing@setect.com</a></p>
    `
    : `
      <div class="pill" style="background:#fff1f2;color:#dc2626;border-color:#dc2626;">Réponse enregistrée</div>
      <h1>Bonjour ${data.prenom},</h1>
      <p>Nous avons bien pris note de votre absence à l'événement <strong>SETECT Exclusive Event</strong> du 18 Juin 2026.</p>
      <p>Nous espérons pouvoir compter sur votre présence lors d'un prochain événement. Merci pour votre retour.</p>
      <p>N'hésitez pas à nous contacter pour tout renseignement :</p>
      <p><a href="mailto:marketing@setect.com" style="color:#1E4D72;font-weight:600;">marketing@setect.com</a></p>
    `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"SETECT Events" <events@setect.cm>',
    to,
    subject: isConfirme
      ? 'SETECT Exclusive Event — Confirmation de présence ✓'
      : 'SETECT Exclusive Event — Réponse enregistrée',
    html: emailBase(content),
  })
}

export async function sendAdminNotification(data: {
  nom: string
  prenom: string
  entreprise: string
  email: string
  telephone: string
  statut: 'confirme' | 'absent'
}) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL
  if (!adminEmail) return

  const transporter = createTransporter()
  const isConfirme = data.statut === 'confirme'

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"SETECT Events" <events@setect.cm>',
    to: adminEmail,
    subject: `[RSVP] ${isConfirme ? '✅' : '❌'} ${data.nom} ${data.prenom} — ${data.entreprise}`,
    html: emailBase(`
      <h1>Nouvelle réponse RSVP</h1>
      <div class="info-box">
        <div class="info-row"><span class="icon">👤</span> <strong>${data.nom} ${data.prenom}</strong></div>
        <div class="info-row"><span class="icon">🏢</span> ${data.entreprise}</div>
        <div class="info-row"><span class="icon">✉️</span> ${data.email}</div>
        <div class="info-row"><span class="icon">📞</span> ${data.telephone}</div>
        <div class="info-row"><span class="icon">${isConfirme ? '✅' : '❌'}</span> <strong style="color:${isConfirme ? '#16a34a' : '#dc2626'}">${isConfirme ? 'CONFIRMÉ' : 'ABSENT'}</strong></div>
      </div>
    `),
  })
}
