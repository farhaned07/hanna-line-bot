import { useState } from 'react';
import { usePatients } from '../hooks/useNurseData';
import { Link } from 'react-router-dom';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/StatusBanners';
import { Users, Search, Filter, ArrowUpDown } from 'lucide-react';

/**
 * Patients List Page - Dark Mode Enterprise Design
 * Browse and search all registered patients
 */
export default function Patients() {
    const { patients, loading, error, refresh } = usePatients();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter patients
    const filteredPatients = patients?.filter(patient => {
        const matchesSearch = patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.condition?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || patient.enrollment_status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="w-7 h-7 text-blue-400" />
                        Patients
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filteredPatients.length} registered patients
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#13151A] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-[#13151A] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending_verification">Pending</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-[#13151A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {loading ? (
                    <SkeletonTable rows={8} />
                ) : filteredPatients.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            title="No Patients Found"
                            description={searchQuery ? "Try adjusting your search query" : "No patients registered yet"}
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
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Condition
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Age
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPatients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                to={`/dashboard/patients/${patient.id}`}
                                                className="text-white font-medium hover:text-indigo-400 transition-colors"
                                            >
                                                {patient.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={patient.enrollment_status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                            {patient.condition || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                            {patient.age || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                                            {patient.created_at
                                                ? new Date(patient.created_at).toLocaleDateString()
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        active: 'bg-green-500/20 text-green-400 ring-green-500/30',
        pending_verification: 'bg-amber-500/20 text-amber-400 ring-amber-500/30',
        inactive: 'bg-slate-500/20 text-slate-400 ring-slate-500/30'
    };

    const labels = {
        active: 'Active',
        pending_verification: 'Pending',
        inactive: 'Inactive'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${styles[status] || styles.inactive}`}>
            {labels[status] || status}
        </span>
    );
}
