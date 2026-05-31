import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
  Search,
  LogOut,
  Filter,
  Mail,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import SetectLogo from '../components/SetectLogo'

interface RsvpEntry {
  id: number
  nom: string
  prenom: string
  entreprise: string
  fonction: string
  email: string
  telephone: string
  statut: 'confirme' | 'absent'
  createdAt: string
}

interface Stats {
  total: number
  confirmes: number
  absents: number
  taux: number
}

interface ApiResponse {
  data: RsvpEntry[]
  stats: Stats
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

function getAuthHeader() {
  const token = localStorage.getItem('admin_token')
  return { Authorization: `Bearer ${token}` }
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
  bg: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: bg, color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black" style={{ color, fontFamily: 'Barlow, sans-serif' }}>
        {value}
      </p>
    </div>
  )
}

const PAGE_SIZE = 15

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState<'all' | 'confirme' | 'absent'>('all')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading, refetch, isRefetching } = useQuery<ApiResponse>({
    queryKey: ['rsvp-list', search, filterStatut, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(search && { search }),
        ...(filterStatut !== 'all' && { statut: filterStatut }),
      })
      const res = await axios.get(`/api/admin/rsvp?${params}`, { headers: getAuthHeader() })
      return res.data
    },
    refetchInterval: 30000,
    retry: (count, err) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) return false
      return count < 2
    },
  })

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const handleExport = async (format: 'xlsx' | 'csv') => {
    try {
      const res = await axios.get(`/api/admin/export?format=${format}`, {
        headers: getAuthHeader(),
        responseType: 'blob',
      })
      const ext = format === 'xlsx' ? 'xlsx' : 'csv'
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `setect-rsvp-${new Date().toISOString().slice(0, 10)}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Erreur lors de l'export")
    }
  }

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm('Supprimer cette entrée ? Cette action est irréversible.')) return
      try {
        await axios.delete(`/api/admin/rsvp/${id}`, { headers: getAuthHeader() })
        refetch()
      } catch {
        alert('Erreur lors de la suppression')
      } finally {
        setDeleteId(null)
      }
    },
    [refetch],
  )

  const stats = data?.stats
  const entries = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
      {/* Header */}
      <header
        className="px-4 py-4 flex items-center justify-between shadow-sm"
        style={{ background: '#1E4D72' }}
      >
        <SetectLogo variant="white" className="h-10 w-auto" />
        <div className="flex items-center gap-3">
          <span className="text-blue-200 text-sm hidden sm:block">Administration</span>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
            title="Actualiser"
          >
            <RefreshCw size={16} className={isRefetching ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-blue-200 hover:text-white hover:bg-white/10 transition-all"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className="text-2xl font-black text-gray-800"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            Dashboard RSVP
          </h1>
          <p className="text-gray-500 text-sm">SETECT Exclusive Event — 18 Juin 2026</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users size={16} />}
            label="Total invités"
            value={stats?.total ?? '—'}
            color="#1E4D72"
            bg="#1E4D7215"
          />
          <StatCard
            icon={<CheckCircle size={16} />}
            label="Confirmés"
            value={stats?.confirmes ?? '—'}
            color="#16a34a"
            bg="#16a34a15"
          />
          <StatCard
            icon={<XCircle size={16} />}
            label="Absents"
            value={stats?.absents ?? '—'}
            color="#dc2626"
            bg="#dc262615"
          />
          <StatCard
            icon={<TrendingUp size={16} />}
            label="Taux de participation"
            value={stats ? `${stats.taux}%` : '—'}
            color="#F28F27"
            bg="#F28F2715"
          />
        </div>

        {/* Progress bar */}
        {stats && stats.total > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-700">Taux de participation</span>
              <span className="font-bold" style={{ color: '#F28F27' }}>
                {stats.taux}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${stats.taux}%`,
                  background: 'linear-gradient(90deg, #F28F27, #39A5DE)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{stats.confirmes} présents</span>
              <span>{stats.absents} absents</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Rechercher par nom, email, téléphone, entreprise..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#39A5DE] focus:ring-2 focus:ring-[#39A5DE]/20 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <select
                value={filterStatut}
                onChange={e => {
                  setFilterStatut(e.target.value as 'all' | 'confirme' | 'absent')
                  setPage(1)
                }}
                className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#39A5DE] transition-all bg-white"
              >
                <option value="all">Tous</option>
                <option value="confirme">Confirmés</option>
                <option value="absent">Absents</option>
              </select>
            </div>

            {/* Export buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('xlsx')}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: '#16a34a' }}
              >
                <Download size={14} />
                Excel
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ background: '#1E4D72', color: '#fff' }}
              >
                <Download size={14} />
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <RefreshCw size={20} className="animate-spin mr-2" />
              Chargement...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Users size={32} className="mb-2 opacity-40" />
              <p className="text-sm">Aucune réponse trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {[
                      'Nom & Prénom',
                      'Entreprise',
                      'Fonction',
                      'Email',
                      'Téléphone',
                      'Statut',
                      'Date',
                      'Actions',
                    ].map(h => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {entries.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {entry.nom} {entry.prenom}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{entry.entreprise}</td>
                      <td className="px-4 py-3 text-gray-600">{entry.fonction}</td>
                      <td className="px-4 py-3 text-gray-600">{entry.email}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{entry.telephone}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={
                            entry.statut === 'confirme'
                              ? { background: '#dcfce7', color: '#16a34a' }
                              : { background: '#fee2e2', color: '#dc2626' }
                          }
                        >
                          {entry.statut === 'confirme' ? (
                            <>
                              <CheckCircle size={11} /> Confirmé
                            </>
                          ) : (
                            <>
                              <XCircle size={11} /> Absent
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <a
                            href={`mailto:${entry.email}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1E4D72] hover:bg-[#1E4D72]/10 transition-all"
                            title="Contacter"
                          >
                            <Mail size={14} />
                          </a>
                          <button
                            onClick={() => {
                              setDeleteId(entry.id)
                              handleDelete(entry.id)
                            }}
                            disabled={deleteId === entry.id}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {pagination.total} résultat{pagination.total > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#1E4D72] hover:text-[#1E4D72] disabled:opacity-40 transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-gray-600">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#1E4D72] hover:text-[#1E4D72] disabled:opacity-40 transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
