import { useState, useEffect } from 'react'
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    RefreshCw,
    Shield,
    User,
    Eye,
    Copy,
    Check,
    X,
    Loader2,
    AlertCircle
} from 'lucide-react'
import api from '../lib/api'

/**
 * Staff Management Page
 * Allows hospital admins to manage their team members
 */
export default function Staff() {
    const [staff, setStaff] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showTokenModal, setShowTokenModal] = useState(false)
    const [newToken, setNewToken] = useState('')
    const [copiedToken, setCopiedToken] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'nurse'
    })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(null)

    // Fetch staff list
    const fetchStaff = async () => {
        try {
            setLoading(true)
            const response = await api.get('/api/admin/staff')
            setStaff(response.data.staff || [])
            setError(null)
        } catch (err) {
            console.error('Failed to fetch staff:', err)
            setError('Failed to load staff members')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    // Create new staff
    const handleCreate = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError(null)

        try {
            const response = await api.post('/api/admin/staff', formData)

            // Show the token modal
            setNewToken(response.data.authToken)
            setShowCreateModal(false)
            setShowTokenModal(true)

            // Reset form and refresh list
            setFormData({ name: '', email: '', role: 'nurse' })
            fetchStaff()
        } catch (err) {
            console.error('Failed to create staff:', err)
            setFormError(err.response?.data?.error || 'Failed to create staff member')
        } finally {
            setFormLoading(false)
        }
    }

    // Deactivate staff
    const handleDeactivate = async (staffId, staffName) => {
        if (!confirm(`Are you sure you want to deactivate ${staffName}? They will no longer be able to log in.`)) {
            return
        }

        try {
            await api.delete(`/api/admin/staff/${staffId}`)
            fetchStaff()
        } catch (err) {
            console.error('Failed to deactivate staff:', err)
            alert('Failed to deactivate staff member')
        }
    }

    // Regenerate token
    const handleRegenerateToken = async (staffId, staffName) => {
        if (!confirm(`Regenerate access token for ${staffName}? The old token will stop working immediately.`)) {
            return
        }

        try {
            const response = await api.post(`/api/admin/staff/${staffId}/regenerate-token`)
            setNewToken(response.data.authToken)
            setShowTokenModal(true)
        } catch (err) {
            console.error('Failed to regenerate token:', err)
            alert('Failed to regenerate token')
        }
    }

    // Copy token to clipboard
    const copyToken = async () => {
        try {
            await navigator.clipboard.writeText(newToken)
            setCopiedToken(true)
            setTimeout(() => setCopiedToken(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            case 'nurse': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'viewer': return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return Shield
            case 'nurse': return User
            case 'viewer': return Eye
            default: return User
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Staff Management</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Manage your team's access to the Hanna dashboard
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Staff
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                </div>
            )}

            {/* Staff Table */}
            {!loading && !error && (
                <div className="bg-[#13151A] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                                    <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {staff.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-500">
                                            <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                            <p>No staff members yet</p>
                                            <button
                                                onClick={() => setShowCreateModal(true)}
                                                className="mt-2 text-indigo-400 hover:text-indigo-300"
                                            >
                                                Add your first team member
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    staff.map((member) => {
                                        const RoleIcon = getRoleIcon(member.role)
                                        return (
                                            <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                            {member.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-white font-medium">{member.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-400">{member.email}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
                                                        <RoleIcon className="w-3 h-3" />
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${member.status === 'active'
                                                            ? 'bg-emerald-500/10 text-emerald-400'
                                                            : 'bg-slate-500/10 text-slate-400'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-slate-500 text-sm">
                                                    {member.last_login
                                                        ? new Date(member.last_login).toLocaleDateString()
                                                        : 'Never'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleRegenerateToken(member.id, member.name)}
                                                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                            title="Regenerate Token"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeactivate(member.id, member.name)}
                                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Deactivate"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Staff Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#13151A] rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Add Staff Member</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            {formError && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#0B0D12] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                                    placeholder="e.g. Nurse Supatra"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#0B0D12] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                                    placeholder="nurse@hospital.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#0B0D12] border border-white/10 rounded-lg text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                                >
                                    <option value="nurse">Nurse</option>
                                    <option value="admin">Admin</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-2.5 border border-white/10 text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Token Display Modal */}
            {showTokenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#13151A] rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Access Token Generated</h2>
                            <button
                                onClick={() => { setShowTokenModal(false); setNewToken(''); }}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                            <p className="text-amber-400 text-sm">
                                ⚠️ This token will only be shown once. Make sure to copy and save it securely.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-[#0B0D12] border border-white/10 rounded-lg p-3">
                            <code className="flex-1 text-emerald-400 font-mono text-sm break-all">
                                {newToken}
                            </code>
                            <button
                                onClick={copyToken}
                                className={`p-2 rounded-lg transition-colors ${copiedToken ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/10 text-slate-400'}`}
                            >
                                {copiedToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <p className="text-slate-500 text-sm mt-4">
                            Share this token with the staff member. They will use it to log into the dashboard.
                        </p>

                        <button
                            onClick={() => { setShowTokenModal(false); setNewToken(''); }}
                            className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
