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
  const bannerUrl = process.env.EMAIL_BANNER_URL
  const banner = bannerUrl
    ? `<tr>
         <td align="center" style="padding:0;">
           <img src="${bannerUrl}" alt="SETECT" width="600" style="width:100%;max-width:600px;height:auto;display:block;border:0;outline:none;text-decoration:none;" />
         </td>
       </tr>`
    : ''
  return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SETECT Event</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;">
          ${banner}
          <tr>
            <td align="center" style="background-color:#1E4D72;padding:28px 24px;">
              <div style="color:#ffffff;font-family:Arial, sans-serif;font-size:24px;font-weight:800;letter-spacing:0.5px;line-height:1;">SETECT</div>
              <div style="color:#cbd5e1;font-family:Arial, sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-top:4px;line-height:1;">Secure and Protect Your Data</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;">
              <div style="font-family:Arial, sans-serif;color:#94a3b8;font-size:12px;line-height:18px;">© ${new Date().getFullYear()} SETECT — Plateforme RSVP sécurisée</div>
              <div style="font-family:Arial, sans-serif;color:#94a3b8;font-size:12px;line-height:18px;margin-top:4px;">marketing@setect.com </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <div style="display:none;white-space:nowrap;font:15px courier;line-height:0;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  <img src="https://ci6.googleusercontent.com/proxy/transparent" width="1" height="1" alt="" style="display:block;border:0;outline:none;text-decoration:none;" />
  
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
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td height="12" style="line-height:12px;font-size:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;">
              <tr>
                <td align="center" bgcolor="#F28F27" style="background-color:#F28F27;padding:14px 12px;">
                  <div style="color:#ffffff;font-family:Arial, sans-serif;font-size:14px;font-weight:900;letter-spacing:1px;text-transform:uppercase;line-height:1.4;word-break:break-word;word-wrap:break-word;mso-line-height-rule:exactly;text-align:center;">CONFIRMATION DE PRÉSENCE</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td height="16" style="line-height:16px;font-size:0;">&nbsp;</td>
        </tr>
      </table>
      <h1 style="margin:0 0 12px 0;font-family:Arial, sans-serif;color:#1E4D72;font-size:20px;line-height:1.3;">Bonjour ${data.prenom} !</h1>
      <p style="margin:0 0 12px 0;font-family:Arial, sans-serif;color:#475569;font-size:14px;line-height:1.6;">Votre participation au <strong>LANCEMENT OFFICIEL DE SETECT</strong> a bien été confirmée.</p>
      <p style="margin:0 0 16px 0;font-family:Arial, sans-serif;color:#475569;font-size:14px;line-height:1.6;">Nous sommes ravis de vous accueillir pour cette soiree de lancement</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border-radius:8px;">
        <tr>
          <td style="padding:16px 16px 0 16px;font-family:Arial, sans-serif;color:#1E4D72;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Détails de l'événement</td>
        </tr>
        <tr>
          <td style="padding:10px 16px 0 16px;font-family:Arial, sans-serif;color:#334155;font-size:13px;"><strong>Date:</strong> 18 Juin 2026</td>
        </tr>
        <tr>
          <td style="padding:6px 16px 0 16px;font-family:Arial, sans-serif;color:#334155;font-size:13px;"><strong>Heure:</strong> 15h00 – 21h00</td>
        </tr>
        <tr>
          <td style="padding:6px 16px 16px 16px;font-family:Arial, sans-serif;color:#334155;font-size:13px;"><strong>Lieu:</strong> Elite Offices, Akwa – Douala</td>
        </tr>
      </table>
      <p style="margin:0;font-family:Arial, sans-serif;color:#94a3b8;font-size:12px;line-height:1.6;">Pour toute question, contactez-nous à <a href="mailto:marketing@setect.com" style="color:#1E4D72;text-decoration:none;">marketing@setect.com</a></p>
    `
    : `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td height="12" style="line-height:12px;font-size:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;">
              <tr>
                <td align="center" bgcolor="#dc2626" style="background-color:#dc2626;padding:14px 12px;">
                  <div style="color:#ffffff;font-family:Arial, sans-serif;font-size:14px;font-weight:900;letter-spacing:1px;text-transform:uppercase;line-height:1.4;word-break:break-word;word-wrap:break-word;mso-line-height-rule:exactly;text-align:center;">RÉPONSE ENREGISTRÉE</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td height="16" style="line-height:16px;font-size:0;">&nbsp;</td>
        </tr>
      </table>
      <h1 style="margin:0 0 12px 0;font-family:Arial, sans-serif;color:#1E4D72;font-size:20px;line-height:1.3;">Bonjour ${data.prenom},</h1>
      <p style="margin:0 0 12px 0;font-family:Arial, sans-serif;color:#475569;font-size:14px;line-height:1.6;">Nous avons bien pris note de votre absence à l'événement <strong>SETECT LANCEMENT OFFICIEL</strong> du 18 Juin 2026.</p>
      <p style="margin:0 0 12px 0;font-family:Arial, sans-serif;color:#475569;font-size:14px;line-height:1.6;">Nous espérons pouvoir compter sur votre présence lors d'un prochain événement. Merci pour votre retour.</p>
      <p style="margin:0 0 4px 0;font-family:Arial, sans-serif;color:#475569;font-size:14px;line-height:1.6;">N'hésitez pas à nous contacter pour tout renseignement :</p>
      <p style="margin:0;font-family:Arial, sans-serif;"><a href="mailto:marketing@setect.com" style="color:#1E4D72;font-weight:600;text-decoration:none;">marketing@setect.com</a></p>
    `

  const subject = isConfirme
    ? 'SETECT LANCEMENT OFFICIEL — Confirmation de présence'
    : 'SETECT LANCEMENT OFFICIEL — Réponse enregistrée'

  const mailOptions: any = {
    from: process.env.SMTP_FROM || '"SETECT Events" <events@setect.cm>',
    to,
    subject,
    html: emailBase(content),
  }

  if (isConfirme) {
    const pad = (n: number) => String(n).padStart(2, '0')
    const now = new Date()
    const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
    const uid = `setect-event-20260618-${Date.now()}@setect.cm`
    const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
    const location = esc('Elite Offices, Akwa – Douala')
    const description = esc("SETECT LANCEMENT OFFICIEL")
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SETECT//RSVP//FR',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      'ORGANIZER;CN=SETECT Events:mailto:events@setect.cm',
      'DTSTART:20260618T140000Z',
      'DTEND:20260618T200000Z',
      'SUMMARY:SETECT LANCEMENT OFFICIEL',
      `LOCATION:${location}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n')
    mailOptions.attachments = [
      {
        filename: 'SETECT-Lancement.ics',
        content: ics,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      },
    ]
  }

  await transporter.sendMail(mailOptions)
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
    subject: `[RSVP] ${isConfirme ? 'CONFIRME' : 'ABSENT'} ${data.nom} ${data.prenom} — ${data.entreprise}`,
    html: emailBase(`
      <h1 style="margin:0 0 12px 0;font-family:Arial, sans-serif;color:#1E4D72;font-size:20px;line-height:1.3;">Nouvelle réponse RSVP</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border-radius:8px;">
        <tr>
          <td style="padding:12px 16px;font-family:Arial, sans-serif;color:#334155;font-size:13px;border-bottom:1px solid #e2e8f0;"><strong>Nom:</strong> ${data.nom} ${data.prenom}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-family:Arial, sans-serif;color:#334155;font-size:13px;border-bottom:1px solid #e2e8f0;"><strong>Entreprise:</strong> ${data.entreprise}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-family:Arial, sans-serif;color:#334155;font-size:13px;border-bottom:1px solid #e2e8f0;"><strong>Email:</strong> ${data.email}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-family:Arial, sans-serif;color:#334155;font-size:13px;border-bottom:1px solid #e2e8f0;"><strong>Téléphone:</strong> ${data.telephone}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px 16px 16px;font-family:Arial, sans-serif;color:${isConfirme ? '#16a34a' : '#dc2626'};font-size:13px;"><strong>Statut:</strong> ${isConfirme ? 'CONFIRMÉ' : 'ABSENT'}</td>
        </tr>
      </table>
    `),
  })
}
