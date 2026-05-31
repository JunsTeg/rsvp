import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Calendar, Clock, MapPin, Mail, ArrowLeft } from 'lucide-react'
import SetectLogo from '../assets/logo-blanc.png'

export default function ConfirmationPage() {
  const [params] = useSearchParams()
  const statut = params.get('statut')
  const prenom = params.get('prenom') || 'cher(e) invité(e)'
  const isConfirme = statut === 'confirme'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(160deg, #0d2d4a 0%, #1E4D72 100%)' }}
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <img src={SetectLogo} alt="SETEC" className="h-14 w-auto" />
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            {isConfirme ? (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(34,197,94,0.2)',
                  border: '2px solid rgba(34,197,94,0.4)',
                }}
              >
                <CheckCircle size={48} className="text-green-400" />
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(239,68,68,0.2)',
                  border: '2px solid rgba(239,68,68,0.3)',
                }}
              >
                <XCircle size={48} className="text-red-400" />
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <h1
              className="text-3xl font-black text-white mb-3"
              style={{ fontFamily: 'Barlow, sans-serif' }}
            >
              {isConfirme ? 'Merci !' : 'Réponse enregistrée'}
            </h1>
            <p className="text-blue-200 text-sm mb-6">
              {isConfirme
                ? `Bonjour ${prenom}, votre participation a bien été confirmée. Un email de confirmation vous a été envoyé.`
                : `Bonjour ${prenom}, nous avons bien pris note de votre absence. Merci pour votre retour.`}
            </p>

            {isConfirme && (
              <div
                className="rounded-2xl p-5 mb-6 text-left"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                  Rappel de l'événement
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: <Calendar size={15} />, text: '18 Juin 2026' },
                    { icon: <Clock size={15} />, text: '15h – 21h' },
                    { icon: <MapPin size={15} />, text: 'Immeuble Elite Offices, Rez-de-chaussée, Rue Dubois de Saligny, Douala' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-blue-200 text-sm">
                      <span style={{ color: '#39A5DE' }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <a
                href="mailto:marketing@setect.com"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Mail size={15} />
                Contacter SETECT
              </a>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-blue-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={15} />
                Retour à l'accueil
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
