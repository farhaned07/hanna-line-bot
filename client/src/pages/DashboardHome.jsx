import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AlertTriangle, Users, CheckCircle, Clock } from 'lucide-react'

export default function DashboardHome() {
    const [stats, setStats] = useState({
        activePatients: 0,
        todayCheckins: 0,
        redFlags: 0,
        pendingPayments: 0
    })
    const [recentAlerts, setRecentAlerts] = useState([])

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // 1. Active Patients
            const { count: activeCount } = await supabase
                .from('chronic_patients')
                .select('*', { count: 'exact', head: true })
                .eq('enrollment_status', 'active')

            // 2. Pending Payments
            const { count: pendingPaymentCount } = await supabase
                .from('chronic_patients')
                .select('*', { count: 'exact', head: true })
                .eq('enrollment_status', 'pending_verification')

            // 3. Today's Checkins
            const today = new Date().toISOString().split('T')[0]
            const { count: checkinCount } = await supabase
                .from('check_ins')
                .select('*', { count: 'exact', head: true })
                .gte('check_in_time', today)

            // 4. Recent "Red Flag" Alerts (last 24h)
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            const { data: alerts, error: alertError } = await supabase
                .from('check_ins')
                .select(`
            *,
            chronic_patients (name, line_user_id)
         `)
                .eq('alert_level', 'red')
                .gte('check_in_time', yesterday)
                .order('check_in_time', { ascending: false })
                .limit(5)

            setStats({
                activePatients: activeCount || 0,
                todayCheckins: checkinCount || 0,
                redFlags: alerts?.length || 0,
                pendingPayments: pendingPaymentCount || 0
            })
            setRecentAlerts(alerts || [])

        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Mission Control
            </h1>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Active Patients</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.activePatients}</dd>
                    <div className="absolute top-4 right-4 text-green-500"><Users className="h-6 w-6" /></div>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Today's Check-ins</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.todayCheckins}</dd>
                    <div className="absolute top-4 right-4 text-blue-500"><CheckCircle className="h-6 w-6" /></div>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Pending Payments</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.pendingPayments}</dd>
                    <div className="absolute top-4 right-4 text-yellow-500"><Clock className="h-6 w-6" /></div>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Recent Red Flags</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">{stats.redFlags}</dd>
                    <div className="absolute top-4 right-4 text-red-500"><AlertTriangle className="h-6 w-6" /></div>
                </div>
            </dl>

            <div className="mt-8">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Recent Alerts</h2>
                <div className="mt-4 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Patient</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Incident</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value/Symptom</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentAlerts.length === 0 ? (
                                        <tr><td colSpan="4" className="py-4 text-center text-sm text-gray-500">No recent alerts</td></tr>
                                    ) : (
                                        recentAlerts.map((alert) => (
                                            <tr key={alert.id} className="bg-red-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                    {alert.chronic_patients?.name || 'Unknown'} <span className="text-xs text-gray-500">({alert.line_user_id.slice(0, 8)})</span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {alert.glucose_level ? 'High/Low Glucose' : 'Emergency Symptom'}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {alert.glucose_level ? `${alert.glucose_level} mg/dL` : alert.symptoms}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(alert.check_in_time).toLocaleString()}
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
