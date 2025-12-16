/**
 * Skeleton Loading Components
 * Provides visual feedback during data loading with pulse animations.
 * Used instead of spinners for a more polished enterprise feel.
 */

export function SkeletonCard({ className = '' }) {
    return (
        <div className={`animate-pulse bg-slate-800 rounded-lg p-6 ${className}`}>
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-slate-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/4"></div>
        </div>
    );
}

export function SkeletonRow({ className = '' }) {
    return (
        <div className={`animate-pulse flex items-center gap-4 p-4 ${className}`}>
            <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-slate-700 rounded w-16"></div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }) {
    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="animate-pulse bg-slate-750 p-4 border-b border-slate-700">
                <div className="flex gap-4">
                    <div className="h-4 bg-slate-700 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/6"></div>
                </div>
            </div>
            {/* Rows */}
            {[...Array(rows)].map((_, i) => (
                <SkeletonRow key={i} className="border-b border-slate-700 last:border-0" />
            ))}
        </div>
    );
}

export function SkeletonMetrics({ count = 4 }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonPatientGrid({ count = 20 }) {
    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-10 gap-2">
                    {[...Array(count)].map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-slate-700 rounded-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SkeletonTimeline({ count = 5 }) {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
