import { useRef } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Shield,
  Users,
  Lightbulb,
  Utensils,
  Mail,
  Phone,
  ChevronDown,
} from 'lucide-react'
import SetectLogo from '../assets/logo-blanc.png'
import EliteLogo from '../assets/elite.png'
//import ChiPhoto from '../assets/chi.jpeg'
//import HervePhoto from '../assets/herve.jpeg'
//import BoubaPhoto from '../assets/bouba.jpeg'
import Countdown from '../components/Countdown'
import RSVPForm from '../components/RSVPForm'
import { FireworksBackground } from '../components/fireworks'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

export default function HomePage() {
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-8 sm:py-10 xl:py-12"
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
        <div className="absolute inset-0 z-10 bg-[#020617]/10 pointer-events-none" />
        {/* Background decoration */}
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
            style={{ background: '#39A5DE', filter: 'blur(80px)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: '#F28F27', filter: 'blur(60px)' }}
          />
          {/* Circuit-like pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            viewBox="0 0 1440 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0 400 Q360 200 720 400 Q1080 600 1440 400"
              stroke="#39A5DE"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M0 300 Q360 100 720 300 Q1080 500 1440 300"
              stroke="#F28F27"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M0 500 Q360 300 720 500 Q1080 700 1440 500"
              stroke="#39A5DE"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </div>

        <div className="relative z-30 mx-auto w-full max-w-4xl text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex justify-center sm:mb-6 lg:mb-8"
          >
            <div className="px-4 py-3 drop-shadow-[0_0_44px_rgba(57,165,222,0.45)] sm:px-6 sm:py-4 xl:px-8 xl:py-6">
              <img src={SetectLogo} alt="SETECT" className="h-[4.6rem] w-auto scale-[1.25] sm:h-[5.8rem] sm:scale-[1.32] xl:h-[7rem] xl:scale-[1.4]" />
            </div>
          </motion.div>

          {/* Badge 
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{
              background: 'rgba(242,143,39,0.2)',
              color: '#F28F27',
              border: '1px solid rgba(242,143,39,0.3)',
            }}
          >
            <Shield size={12} />
            Invitation Exclusive
          </motion.div>*/}

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mb-4 text-[2.35rem] font-black leading-[0.92] text-white sm:text-5xl md:text-6xl xl:text-7xl"
            style={{ fontFamily: 'Barlow, Inter, sans-serif' }}
          >
            <span style={{ color: '#F28F27' }}>LANCEMENT</span><br />
            <span style={{ color: '#ffffff' }}>OFFICIEL</span>
          </motion.h1>

          {/* Subtitle 
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="text-blue-200 text-base sm:text-lg mb-8 max-w-xl mx-auto"
          >
            Rencontre stratégique exclusive dédiée aux enjeux de Cyber Résilience pour les
            entreprises en zone CEMAC.
          </motion.p>*/}

          {/* Event Info Pills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mx-auto mb-6 grid max-w-4xl gap-3 sm:mb-8 sm:grid-cols-3 xl:mb-10"
          >
            {[
              { icon: <Calendar size={17} />, text: '18 Juin 2026' },
              { icon: <Clock size={17} />, text: '15h – 21h' },
              { icon: <MapPin size={17} />, text: "La Table De L'Elite" },
            ].map(item => (
              <div
                key={item.text}
                className="flex min-h-[3.75rem] w-full items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-base font-semibold text-white shadow-lg backdrop-blur-md sm:min-h-[4.5rem] sm:gap-3 sm:px-4 sm:text-lg xl:min-h-[5rem]"
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

          {/* Countdown */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mb-6 sm:mb-8 xl:mb-10"
          >
            <p className="text-blue-300 text-xs uppercase tracking-widest mb-4">
              L'événement commence dans
            </p>
            <div className="flex justify-center">
              <Countdown />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-100 sm:px-8 sm:py-4 sm:text-base"
              style={{
                background: 'linear-gradient(135deg, #F28F27 0%, #d4770f 100%)',
                boxShadow: '0 8px 30px rgba(242, 143, 39, 0.5)',
              }}
            >
              Confirmer ma présence
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="relative z-30 mt-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center -space-y-8 sm:-space-y-12">
            <ChevronDown className="h-12 w-12 text-blue-300 opacity-60 sm:h-[70px] sm:w-[70px]" />
            <ChevronDown className="h-12 w-12 text-blue-300 opacity-60 sm:h-[70px] sm:w-[70px]" />
          </div>
        </motion.div>
      </section>

      {/* ─── PROGRAMME ───────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-4xl font-semibold uppercase tracking-widest mb-3"
              style={{ background: '#fff7ed', color: '#122947' }}
            >
              Agenda
            </span>
            <div className="flex justify-center gap-2 mt-4">
              <span className="h-1 w-12 rounded-full" style={{ background: '#39A5DE' }} />
              <span className="h-1 w-12 rounded-full" style={{ background: '#F28F27' }} />
            </div>
          </motion.div>

          <div className="relative mb-12 rounded-[2rem] border border-slate-200 bg-white/80 p-4 sm:p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="absolute left-[8.5rem] top-8 bottom-8 hidden w-px bg-gradient-to-b from-[#39A5DE] via-[#F28F27] to-[#0d2d4a] sm:block" />
            {[
              {
                time: '15h00',
                title: 'Mot de bienvenue du CEO',
                icon: <Users size={20} />,
              },
              {
                time: '15h15',
                title: 'Réussir sa stratégie de cybersécurité avec une approche par étape',
                icon: <Shield size={20} />,
              },
              {
                time: '15h30',
                title: 'Panel 1 — Cyber résilience & enjeux IT',
                icon: <Users size={20} />,
              },
              {
                time: '16h00',
                title: 'Pause-café',
                icon: <Clock size={20} />,
              },
              {
                time: '16h10',
                title: 'Simplifier son architecture de protection des données sans compromis de performance',
                icon: <Shield size={20} />,
              },
              {
                time: '16h25',
                title: 'Intermède',
                icon: <Lightbulb size={20} />,
              },
              {
                time: '16h55',
                title: 'Panel 2 — Régulation, finance et cyber résilience',
                icon: <Users size={20} />,
              },
              {
                time: '17h25',
                title: 'Mot de fin du CEO',
                icon: <Users size={20} />,
              },
              {
                time: '18h30',
                title: 'Dîner ',
                icon: <Utensils size={20} />,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative grid gap-3 py-3 sm:grid-cols-[6rem_1.5rem_1fr] sm:gap-6 sm:py-4"
              >
                <div className="flex items-center justify-end">
                  <span className="text-sm sm:text-base font-black tabular-nums" style={{ color: '#F28F27' }}>
                    {item.time}
                  </span>
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="h-3 w-3 rounded-full border-2 border-white shadow ring-1" style={{ background: '#0d2d4a', boxShadow: '0 0 0 4px rgba(242,143,39,0.12)' }} />
                </div>
                <div
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50" style={{ color: '#1E4D72' }}>
                    {item.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold uppercase leading-snug tracking-wide" style={{ color: '#0d2d4a', fontFamily: 'Barlow, sans-serif' }}>
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/*<motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="my-28 sm:my-36"
          >
            <div className="mb-10 text-center">
              <h2
                className="text-4xl font-black tracking-tight sm:text-5xl"
                style={{ color: '#122947', fontFamily: 'Barlow, sans-serif' }}
              >
                INTERVENANTS
              </h2>
              <div className="mt-4 flex justify-center gap-2">
                <span className="h-1 w-12 rounded-full" style={{ background: '#39A5DE' }} />
                <span className="h-1 w-12 rounded-full" style={{ background: '#F28F27' }} />
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: 'A REMPLACER',
                  role: '',
                  company: '',
                  //image: ChiPhoto,
                  gradient: 'linear-gradient(135deg, #1E4D72 0%, #39A5DE 100%)',
                },
                {
                  name: 'IRO HERVE MONDOUHO',
                  role: 'Entreprise Account Manager Kaspersky West And Central Africa',
                  company: 'KASPERSKY',
                  image: HervePhoto,
                  gradient: 'linear-gradient(135deg, #F28F27 0%, #f8c07a 100%)',
                },
                {
                  name: 'BOUBACAR KEBE',
                  role: 'Regional Channel Manager',
                  company: 'QUANTUM',
                  image: BoubaPhoto,
                  gradient: 'linear-gradient(135deg, #0f172a 0%, #1E4D72 100%)',
                },
                {
                  name: 'Sophie Tchameni',
                  role: 'Directrice Générale',
                  company: 'DataBridge Solutions',
                  image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sophie-Tchameni',
                  gradient: 'linear-gradient(135deg, #39A5DE 0%, #8fd3f4 100%)',
                },
                {
                  name: 'Marc Ndongo',
                  role: 'Chief Technology Officer',
                  company: 'CloudWave Africa',
                  image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marc-Ndongo',
                  gradient: 'linear-gradient(135deg, #122947 0%, #F28F27 100%)',
                },
                {
                  name: 'Laura Mballa',
                  role: 'Risk & Compliance Manager',
                  company: 'Banking Trust CEMAC',
                  image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Laura-Mballa',
                  gradient: 'linear-gradient(135deg, #64748b 0%, #0f172a 100%)',
                },
                {
                  name: 'Kevin Fouda',
                  role: 'Consultant Cyber Résilience',
                  company: 'CyberShield Advisory',
                  image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Kevin-Fouda',
                  gradient: 'linear-gradient(135deg, #1E4D72 0%, #7dd3fc 100%)',
                },
                {
                  name: 'Nadia Ewane',
                  role: 'Directrice des Opérations',
                  company: 'IT Governance Partners',
                  image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Nadia-Ewane',
                  gradient: 'linear-gradient(135deg, #F28F27 0%, #1E4D72 100%)',
                },
              ].map((speaker, i) => (
                <motion.div
                  key={speaker.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="group text-center"
                >
                  <div className="relative mx-auto mb-7 h-44 w-44 sm:h-48 sm:w-48">
                    <div className="absolute -inset-4 rounded-full bg-[#39A5DE]/10 blur-2xl transition-all duration-300 group-hover:bg-[#F28F27]/20" />
                    <div
                      className="absolute inset-4 rounded-[2.8rem] opacity-95 shadow-2xl shadow-slate-300/80 transition-all duration-500 group-hover:scale-110"
                      style={{ background: speaker.gradient, transform: 'rotate(-16deg)' }}
                    />
                    <div
                      className="absolute inset-1 rounded-[3rem] border border-white bg-white/80 shadow-2xl shadow-slate-300/70 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2"
                      style={{ transform: 'rotate(6deg)' }}
                    />
                    <div
                      className="absolute inset-4 flex items-end justify-center overflow-hidden rounded-[2.35rem] border-4 border-white shadow-xl ring-1 ring-slate-900/5"
                      style={{ background: speaker.gradient }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.55),transparent_34%)]" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                      <img src={speaker.image} alt={speaker.name} className="relative z-10 h-full w-full object-cover object-top" />
                    </div>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 sm:text-base" style={{ fontFamily: 'Barlow, sans-serif' }}>
                    {speaker.name}
                  </h3>
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-600">{speaker.role}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{speaker.company}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>*/}

          {/* Event details card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70"
          >
            <div className="p-6 sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: '#F28F27' }}>
                    Date & localisation
                  </p>
                  <h3 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl" style={{ fontFamily: 'Barlow, sans-serif' }}>
                    Rendez-vous à<br />LA TABLE DE L'ELITE
                  </h3>
                  <div className="mt-4 h-1 w-16 rounded-full" style={{ background: '#39A5DE' }} />

                  <div className="mt-6 grid gap-4 text-slate-600 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50" style={{ color: '#F28F27' }}>
                        <Calendar size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Date</p>
                        <p className="font-bold text-slate-800">18 Juin 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50" style={{ color: '#39A5DE' }}>
                        <Clock size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Heure</p>
                        <p className="font-bold text-slate-800">15h – 21h</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-3 text-slate-500">
                    <MapPin size={18} className="mt-1 shrink-0" style={{ color: '#F28F27' }} />
                    <p className="max-w-2xl text-sm leading-relaxed sm:text-base">
                      Immeuble Elite Offices, Rez-de-chaussée, Rue Dubois de Saligny, Douala
                    </p>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/RKjPFA7VLrVvgVSb8"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex w-fit items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
                    style={{ background: '#4ba892' }}
                  >
                    <MapPin size={15} />
                    Ouvrir dans Google Maps
                  </a>
                </div>

                <div className="flex items-center justify-center rounded-3xl bg-slate-50 p-8 sm:p-10">
                  <img src={EliteLogo} alt="Restaurant la table des elites" className="max-h-44 max-w-full object-contain sm:max-h-56" />
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-inner">
                <iframe
                  title="Localisation Restaurant la table des elites"
                  src="https://www.google.com/maps?q=Immeuble%20Elite%20Offices%20Rue%20Dubois%20de%20Saligny%20Douala&output=embed"
                  className="h-[22rem] w-full border-0 sm:h-[28rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FORMULAIRE RSVP ─────────────────────────────── */}
      <section
        className="py-16 sm:py-24 px-4"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)' }}
        ref={formRef}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl sm:text-4xl font-black mb-3"
                style={{ color: '#1E4D72', fontFamily: 'Barlow, sans-serif' }}
              >
                INSCRIPTION
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10">
              <RSVPForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="py-10 px-4 text-center" style={{ background: 'radial-gradient(circle at 50% 12%, #122947 0%, #07111f 42%, #020617 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <img src={SetectLogo} alt="SETECT" className="h-10 w-auto mx-auto mb-4" />
          <p className="text-white text-xs font-bold mb-4">SECURE AND PROTECT YOUR DATA</p>

          {/* Contact SETECT button */}
          <a
            href="mailto:marketing@setect.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 mb-6"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Mail size={15} />
            Contacter SETECT
          </a>

          <div className="flex items-center justify-center gap-4 text-white text-xs font-bold">
            <a
              href="mailto:marketing@setect.com"
              className="flex items-center gap-1 transition-opacity hover:opacity-80"
            >
              <Mail size={12} /> marketing@setect.com
            </a>
            <span className="opacity-30">·</span>
            <a
              href="tel:+237699656322"
              className="flex items-center gap-1 transition-opacity hover:opacity-80"
            >
              <Phone size={12} /> +237 6 95 39 03 29
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white text-xs font-bold opacity-80">
              © {new Date().getFullYear()} SETECT — Tous droits réservés. Plateforme RSVP sécurisée.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
