import { useState, useRef } from 'react';
import { usePatients } from '../hooks/useNurseData';
import { Link } from 'react-router-dom';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/StatusBanners';
import {
    Users,
    Search,
    Upload,
    X,
    FileSpreadsheet,
    Download,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import api from '../lib/api';

/**
 * Patients List Page - Dark Mode Enterprise Design
 * Browse, search, and bulk upload patients
 */
export default function Patients() {
    const { patients, loading, error, refresh } = usePatients();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Bulk upload state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Filter patients
    const filteredPatients = patients?.filter(patient => {
        const matchesSearch = patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.condition?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || patient.enrollment_status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    // Handle file selection
    const handleFileSelect = (file) => {
        if (file && file.type === 'text/csv') {
            setUploadFile(file);
            setUploadResult(null);
        } else if (file) {
            alert('Please select a CSV file');
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Upload the file
    const handleUpload = async () => {
        if (!uploadFile) return;

        setUploading(true);
        setUploadResult(null);

        try {
            const formData = new FormData();
            formData.append('file', uploadFile);

            const response = await api.post('/api/admin/patients/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUploadResult({
                success: true,
                ...response.data
            });

            // Refresh patient list
            refresh();
        } catch (err) {
            console.error('Upload failed:', err);
            setUploadResult({
                success: false,
                error: err.response?.data?.error || 'Upload failed. Please try again.'
            });
        } finally {
            setUploading(false);
        }
    };

    // Download template
    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/api/admin/patients/csv-template', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'patient_upload_template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Template download failed:', err);
        }
    };

    // Close modal and reset state
    const closeModal = () => {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadResult(null);
    };

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
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    Upload Patients
                </button>
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
                            description={searchQuery ? "Try adjusting your search query" : "No patients registered yet. Upload a CSV to get started."}
                        />
                        {!searchQuery && (
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                >
                                    Upload your first patients →
                                </button>
                            </div>
                        )}
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

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#13151A] rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                                Upload Patients
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Success/Error Result */}
                        {uploadResult && (
                            <div className={`mb-4 p-4 rounded-lg border ${uploadResult.success
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                <div className="flex items-start gap-3">
                                    {uploadResult.success ? (
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        {uploadResult.success ? (
                                            <>
                                                <p className="font-medium">Upload Successful!</p>
                                                <p className="text-sm mt-1">
                                                    ✅ {uploadResult.inserted || 0} patients added
                                                    {uploadResult.skipped > 0 && ` • ⏭️ ${uploadResult.skipped} skipped (duplicates)`}
                                                    {uploadResult.errors > 0 && ` • ❌ ${uploadResult.errors} errors`}
                                                </p>
                                            </>
                                        ) : (
                                            <p>{uploadResult.error}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Drop Zone */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : uploadFile
                                        ? 'border-emerald-500/50 bg-emerald-500/5'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {uploadFile ? (
                                <div className="flex flex-col items-center">
                                    <FileSpreadsheet className="w-12 h-12 text-emerald-400 mb-3" />
                                    <p className="text-white font-medium">{uploadFile.name}</p>
                                    <p className="text-slate-500 text-sm mt-1">
                                        {(uploadFile.size / 1024).toFixed(1)} KB
                                    </p>
                                    <button
                                        onClick={() => setUploadFile(null)}
                                        className="mt-3 text-sm text-slate-400 hover:text-white"
                                    >
                                        Choose different file
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="w-12 h-12 text-slate-500 mb-3" />
                                    <p className="text-slate-300">
                                        Drag and drop your CSV file here
                                    </p>
                                    <p className="text-slate-500 text-sm mt-1">or</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-2 text-indigo-400 hover:text-indigo-300 font-medium"
                                    >
                                        Browse files
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={(e) => handleFileSelect(e.target.files?.[0])}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Template Download */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download CSV template
                            </button>
                            <span className="text-slate-500">
                                Required: name, condition
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 border border-white/10 text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!uploadFile || uploading}
                                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        active: 'bg-green-500/20 text-green-400 ring-green-500/30',
        pending_verification: 'bg-amber-500/20 text-amber-400 ring-amber-500/30',
        inactive: 'bg-slate-500/20 text-slate-400 ring-slate-500/30',
        trial: 'bg-blue-500/20 text-blue-400 ring-blue-500/30',
        onboarding: 'bg-purple-500/20 text-purple-400 ring-purple-500/30'
    };

    const labels = {
        active: 'Active',
        pending_verification: 'Pending',
        inactive: 'Inactive',
        trial: 'Trial',
        onboarding: 'Onboarding'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${styles[status] || styles.inactive}`}>
            {labels[status] || status}
        </span>
    );
}

