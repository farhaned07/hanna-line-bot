import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Patients() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            const { data, error } = await supabase
                .from('chronic_patients')
                .select('*')
                //.eq('enrollment_status', 'active') // Show all for now? Or just active/trial
                .order('created_at', { ascending: false })

            if (error) throw error
            setPatients(data || [])
        } catch (error) {
            console.error('Error fetching patients:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">Patients</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all registered patients including their name, status, and condition.
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
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Condition</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Age</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr><td colSpan="5" className="py-4 text-center">Loading...</td></tr>
                                    ) : patients.length === 0 ? (
                                        <tr><td colSpan="5" className="py-10 text-center text-gray-500">No patients found</td></tr>
                                    ) : (
                                        patients.map((patient) => (
                                            <tr key={patient.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {patient.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${patient.enrollment_status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                            patient.enrollment_status === 'pending_verification' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                                                                'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                        }`}>
                                                        {patient.enrollment_status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.condition}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.age}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(patient.created_at).toLocaleDateString()}
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
