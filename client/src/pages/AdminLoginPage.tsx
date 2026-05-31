import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Lock, User, Loader2, Eye, EyeOff } from 'lucide-react'
import SetectLogo from '../components/SetectLogo'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/admin/login', { username, password })
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin')
    } catch {
      setError('Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0d2d4a 0%, #1E4D72 100%)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <SetectLogo variant="white" className="h-14 w-auto mx-auto mb-4" />
          <p className="text-blue-300 text-sm">Interface Administrateur</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1
            className="text-xl font-bold text-gray-800 mb-6 text-center"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            Connexion Admin
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value)
                  setError('')
                }}
                placeholder="Identifiant"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#39A5DE] focus:ring-2 focus:ring-[#39A5DE]/20 transition-all"
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Mot de passe"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#39A5DE] focus:ring-2 focus:ring-[#39A5DE]/20 transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-1"
              style={{
                background: 'linear-gradient(135deg, #1E4D72 0%, #163a56 100%)',
                boxShadow: '0 4px 15px rgba(30, 77, 114, 0.3)',
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
