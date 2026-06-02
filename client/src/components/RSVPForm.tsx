import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader2, User, Building2, Briefcase, Mail, Phone } from 'lucide-react'

interface FormData {
  nom: string
  prenom: string
  entreprise: string
  fonction: string
  email: string
  telephone: string
  honeypot: string
}

const initialForm: FormData = {
  nom: '',
  prenom: '',
  entreprise: '',
  fonction: '',
  email: '',
  telephone: '',
  honeypot: '',
}

function InputField({
  label,
  icon,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  label: string
  icon: React.ReactNode
  type?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span style={{ color: '#F28F27' }}>*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-200'
              : 'border-gray-200 bg-white focus:border-[#39A5DE] focus:ring-[#39A5DE]/20'
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function SelectField({
  label,
  icon,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string
  icon: React.ReactNode
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  placeholder: string
  required?: boolean
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span style={{ color: '#F28F27' }}>*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full appearance-none pl-10 pr-10 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-200'
              : 'border-gray-200 bg-white focus:border-[#39A5DE] focus:ring-[#39A5DE]/20'
          } ${value ? 'text-gray-800' : 'text-gray-400'}`}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

const functionOptions = [
  'Directeur Général (DG)',
  'Directeur Général Adjoint (DGA)',
  'Directeur des Systèmes d’Information (DSI)',
  'Directeur Administratif et Financier (DAF)',
  'Directeur Commercial (DC)',
  'Directeur Technique (CTO)',
  'Directeur de la Sécurité des Systèmes d’Information (RSSI / CISO)',
  'Directeur des Opérations (COO)',
  'Directeur Financier (CFO)',
  'Directeur Informatique',
  'Responsable IT',
  'Responsable Cybersécurité',
  'Responsable Infrastructure',
  'Responsable Conformité / Risques',
  'Consultant IT / Cybersécurité',
]

export default function RSVPForm() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.nom.trim()) e.nom = 'Le nom est requis'
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis'
    if (!form.entreprise.trim()) e.entreprise = "L'entreprise est requise"
    if (!form.fonction.trim()) e.fonction = 'La fonction est requise'
    if (!form.email.trim()) e.email = "L'email est requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
    if (!form.telephone.trim()) e.telephone = 'Le téléphone est requis'
    else if (!/^[+\d\s().-]{6,30}$/.test(form.telephone)) e.telephone = 'Téléphone invalide'
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(er => ({ ...er, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.honeypot) return

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      await axios.post('/api/rsvp', {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        entreprise: form.entreprise.trim(),
        fonction: form.fonction.trim(),
        email: form.email.trim().toLowerCase(),
        telephone: form.telephone.trim(),
        statut: 'confirme',
      })
      navigate(`/confirmation?statut=confirme&prenom=${encodeURIComponent(form.prenom)}`)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message
        if (err.response?.status === 429) {
          setServerError('Trop de tentatives. Veuillez réessayer dans quelques minutes.')
        } else if (err.response?.status === 409) {
          setServerError('Cet email a déjà été enregistré. Contactez SETECT si nécessaire.')
        } else {
          setServerError(msg || 'Une erreur est survenue. Veuillez réessayer.')
        }
      } else {
        setServerError('Erreur de connexion. Vérifiez votre connexion internet.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot anti-spam */}
      <input
        type="text"
        name="honeypot"
        value={form.honeypot}
        onChange={handleChange}
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label="Nom"
          icon={<User size={16} />}
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="DUPONT"
          required
          error={errors.nom}
        />
        <InputField
          label="Prénom"
          icon={<User size={16} />}
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          placeholder="Jean"
          required
          error={errors.prenom}
        />
      </div>

      <InputField
        label="Entreprise"
        icon={<Building2 size={16} />}
        name="entreprise"
        value={form.entreprise}
        onChange={handleChange}
        placeholder="Nom de votre entreprise"
        required
        error={errors.entreprise}
      />

      <SelectField
        label="Fonction / Poste"
        icon={<Briefcase size={16} />}
        name="fonction"
        value={form.fonction}
        onChange={handleChange}
        options={functionOptions}
        placeholder="Sélectionnez votre fonction"
        required
        error={errors.fonction}
      />

      <InputField
        label="Email professionnel"
        icon={<Mail size={16} />}
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="nom@entreprise.com"
        required
        error={errors.email}
      />

      <InputField
        label="Numéro de téléphone"
        icon={<Phone size={16} />}
        type="tel"
        name="telephone"
        value={form.telephone}
        onChange={handleChange}
        placeholder="+237 6XX XX XX XX"
        required
        error={errors.telephone}
      />

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl text-white font-bold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
        style={{
          background: loading ? '#d4770f' : 'linear-gradient(135deg, #F28F27 0%, #d4770f 100%)',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(242, 143, 39, 0.4)',
        }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          'Je confirme ma présence'
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Plateforme sécurisée SETECT — Vos données sont protégées
      </p>
    </form>
  )
}
