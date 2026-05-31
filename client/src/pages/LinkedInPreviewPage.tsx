import { motion, type Variants } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import SetectLogo from '../assets/logo-blanc.png'
//import Countdown from '../components/Countdown'
import { FireworksBackground } from '../components/fireworks'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

export default function LinkedInPreviewPage() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-8 py-10"
      style={{ background: 'radial-gradient(circle at 50% 12%, #122947 0%, #07111f 42%, #020617 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <FireworksBackground
          className="h-full w-full"
          color={['#39A5DE', '#F28F27', '#ffffff']}
          population={3}
          fireworkSpeed={{ min: 4, max: 6 }}
          fireworkSize={{ min: 2, max: 4 }}
          particleSpeed={{ min: 3, max: 8 }}
          particleSize={{ min: 2, max: 4 }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[#020617]/10" />
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full opacity-10"
          style={{ background: '#39A5DE', filter: 'blur(80px)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full opacity-10"
          style={{ background: '#F28F27', filter: 'blur(60px)' }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-5" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <path d="M0 400 Q360 200 720 400 Q1080 600 1440 400" stroke="#39A5DE" strokeWidth="1" fill="none" />
          <path d="M0 300 Q360 100 720 300 Q1080 500 1440 300" stroke="#F28F27" strokeWidth="1" fill="none" />
          <path d="M0 500 Q360 300 720 500 Q1080 700 1440 500" stroke="#39A5DE" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className="relative z-30 mx-auto w-full max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <div className="px-8 py-6 drop-shadow-[0_0_44px_rgba(57,165,222,0.45)]">
            <img src={SetectLogo} alt="SETECT" className="h-[7rem] w-auto scale-[1.35]" />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mb-8 text-7xl font-black leading-[0.92] text-white"
          style={{ fontFamily: 'Barlow, Inter, sans-serif' }}
        >
          <span style={{ color: '#F28F27' }}>LANCEMENT</span><br />
          <span style={{ color: '#ffffff' }}>OFFICIEL</span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mx-auto mb-10 grid max-w-4xl grid-cols-3 gap-3"
        >
          {[
            { icon: <Calendar size={17} />, text: '18 Juin 2026' },
            { icon: <Clock size={17} />, text: '15h – 21h' },
            { icon: <MapPin size={17} />, text: "Akwa, Douala" },
          ].map(item => (
            <div
              key={item.text}
              className="flex min-h-[5rem] w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-center text-lg font-semibold text-white shadow-lg backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.07))',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 14px 34px rgba(0,0,0,0.16)',
              }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10" style={{ color: '#39A5DE' }}>
                {item.icon}
              </span>
              <span className="min-w-0 max-w-[13rem] leading-snug">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/*<motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <p className="mb-4 text-xs uppercase tracking-widest text-blue-300">L'événement commence dans</p>
          <div className="flex justify-center">
            <Countdown />
          </div>
        </motion.div>*/}
      </div>
    </main>
  )
}
