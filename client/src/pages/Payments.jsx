import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CheckCircle, XCircle, CreditCard, Clock, AlertCircle } from 'lucide-react'
import { SkeletonTable } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/StatusBanners'

/**
 * Payments Page - Dark Mode Enterprise Design
 * Verify pending payment submissions
 */
export default function Payments() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(null)

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            const { data, error } = await supabase
                .from('chronic_patients')
                .select('*')
                .eq('enrollment_status', 'pending_verification')
                .order('subscription_start_date', { ascending: false })

            if (error) throw error
            setPayments(data || [])
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (payment) => {
        if (!confirm(`Verify payment for ${payment.name}? This will activate their account.`)) return

        setProcessing(payment.id)
        try {
            const { error: dbError } = await supabase
                .from('chronic_patients')
                .update({ enrollment_status: 'active' })
                .eq('id', payment.id)

            if (dbError) throw dbError

            await fetch('/api/admin/notify-activation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: payment.line_user_id, name: payment.name })
            })

            fetchPayments()
        } catch (error) {
            console.error('Error verifying payment:', error)
            alert('Error verifying payment')
        } finally {
            setProcessing(null)
        }
    }

    const handleReject = async (payment) => {
        if (!confirm(`Reject payment for ${payment.name}? This will return them to onboarding.`)) return

        setProcessing(payment.id)
        try {
            const { error } = await supabase
                .from('chronic_patients')
                .update({ enrollment_status: 'onboarding' })
                .eq('id', payment.id)

            if (error) throw error
            fetchPayments()
        } catch (error) {
            console.error('Error rejecting:', error)
            alert('Error rejecting payment')
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="w-7 h-7 text-amber-500" />
                    Pending Payments
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">
                    {payments.length} payment{payments.length !== 1 ? 's' : ''} waiting for verification
                </p>
            </div>

            {/* Table */}
            <div className="bg-[#13151A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {loading ? (
                    <SkeletonTable rows={5} />
                ) : payments.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            title="No Pending Payments"
                            description="All payment verifications are complete."
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/5">
                            <thead className="bg-white/[0.02]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className={`hover:bg-white/[0.02] transition-colors ${processing === payment.id ? 'opacity-50' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-white font-medium">{payment.name}</div>
                                            <div className="text-slate-500 text-xs truncate max-w-[200px] font-mono">
                                                {payment.line_user_id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {payment.subscription_plan || 'Standard'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {payment.subscription_start_date
                                                    ? new Date(payment.subscription_start_date).toLocaleDateString()
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleVerify(payment)}
                                                    disabled={processing === payment.id}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Verify
                                                </button>
                                                <button
                                                    onClick={() => handleReject(payment)}
                                                    disabled={processing === payment.id}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-sm font-medium rounded-xl transition-all"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
