import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CheckCircle, XCircle } from 'lucide-react'

export default function Payments() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

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

        try {
            // 1. Update DB Status
            const { error: dbError } = await supabase
                .from('chronic_patients')
                .update({ enrollment_status: 'active' })
                .eq('id', payment.id)

            if (dbError) throw dbError

            // 2. Notify Backend to send LINE message
            // Note: We need to implement this endpoint in the Express server
            await fetch('/api/admin/notify-activation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: payment.line_user_id, name: payment.name })
            })

            // 3. Refresh list
            fetchPayments()
            alert('Payment verified and user activated!')

        } catch (error) {
            console.error('Error verifying payment:', error)
            alert('Error verifying payment')
        }
    }

    const handleReject = async (payment) => {
        if (!confirm(`Reject payment for ${payment.name}? This will return them to onboarding.`)) return

        try {
            const { error } = await supabase
                .from('chronic_patients')
                .update({ enrollment_status: 'onboarding' })
                .eq('id', payment.id)

            if (error) throw error
            fetchPayments()
            alert('Payment rejected.')
        } catch (error) {
            console.error('Error rejecting:', error)
            alert('Error rejecting payment')
        }
    }

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">Pending Payments</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of users who have submitted payment slips but are waiting for verification.
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Plan</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Submitted At</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr><td colSpan="4" className="py-4 text-center">Loading...</td></tr>
                                    ) : payments.length === 0 ? (
                                        <tr><td colSpan="4" className="py-10 text-center text-gray-500">No pending payments</td></tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {payment.name} <div className="text-xs text-gray-500">{payment.line_user_id}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {payment.subscription_plan}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {payment.subscription_start_date ? new Date(payment.subscription_start_date).toLocaleString() : '-'}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                    <button
                                                        onClick={() => handleVerify(payment)}
                                                        className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 hover:bg-green-100"
                                                    >
                                                        <CheckCircle className="mr-1 h-3 w-3" /> Verify
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(payment)}
                                                        className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 hover:bg-red-100"
                                                    >
                                                        <XCircle className="mr-1 h-3 w-3" /> Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
