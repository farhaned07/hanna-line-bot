import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, FileDown, Sparkles, AlertTriangle, Users, Clock, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'
import { t } from '../i18n'
import TabBar from '../components/TabBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function Handover() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [handover, setHandover] = useState(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [generating, setGenerating] = useState(false)

    useEffect(() => {
        generateHandover()
    }, [])

    const generateHandover = async () => {
        setGenerating(true)
        setLoading(true)
        try {
            const data = await api.generateHandover()
            setHandover(data.handover || data)
        } catch (err) {
            setHandover({ patients: [] })
        } finally {
            setLoading(false)
            setGenerating(false)
        }
    }

    const handleCopy = () => {
        if (!handover) return
        const text = handover.patients.map((p, i) =>
            `${i + 1}. ${p.name}${p.is_urgent ? ' ⚠️' : ''}\n   ${p.summary}`
        ).join('\n\n')
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast({
            title: "Copied to clipboard",
            description: "Handover summary copied",
            duration: 2000
        })
        setTimeout(() => setCopied(false), 2000)
    }

    const handleExportPdf = () => {
        if (!handover) return
        api.downloadHandoverPdf(handover).catch(err => {
            toast({
                title: "Export failed",
                description: "Please try again",
                variant: 'destructive'
            })
        })
    }

    const patients = handover?.patients || []
    const urgentCount = patients.filter(p => p.is_urgent).length

    return (
        <div className="min-h-dvh bg-background pb-24">
            <div className="safe-top px-5 pt-12 pb-5">
                <h1 className="text-3xl font-extrabold text-foreground -tracking-wide">
                    {t('handover.title')}
                </h1>
            </div>

            <div className="px-5">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="h-20 bg-card border-border animate-pulse" />
                        ))}
                    </div>
                ) : handover ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Shift Info */}
                        <div className="mb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="primary" className="text-xs font-semibold">
                                    {t('handover.generated', { count: patients.length })}
                                </Badge>
                                {urgentCount > 0 && (
                                    <Badge variant="destructive" className="text-xs font-semibold">
                                        <AlertTriangle size={12} className="mr-1" />
                                        {urgentCount} {t('handover.urgent')}
                                    </Badge>
                                )}
                            </div>
                            
                            {handover.date && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock size={14} />
                                    <span>{handover.date}</span>
                                </div>
                            )}
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <Card className="border-border bg-card shadow-md">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Users size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium">Patients</p>
                                            <p className="text-lg font-bold text-foreground">{patients.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className="border-border bg-card shadow-md">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                                            <AlertTriangle size={16} className="text-destructive" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium">Urgent</p>
                                            <p className="text-lg font-bold text-foreground">{urgentCount}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Patient List */}
                        <div className="space-y-2 mb-4">
                            {patients.map((patient, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className={`border-border bg-card shadow-sm ${patient.is_urgent ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-primary-foreground text-xs font-bold">
                                                        {patient.name?.[0]?.toUpperCase() || 'P'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-foreground">
                                                            {patient.name || `Patient ${index + 1}`}
                                                        </h3>
                                                        {patient.hn && (
                                                            <p className="text-xs text-muted-foreground">
                                                                HN: {patient.hn}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {patient.is_urgent && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        <AlertTriangle size={10} className="mr-1" />
                                                        Urgent
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {patient.summary}
                                            </p>
                                            {patient.tasks && patient.tasks.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {patient.tasks.map((task, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                            {task}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleCopy}
                                className="flex-1 h-11 border-border bg-card hover:bg-accent text-foreground"
                            >
                                <Copy size={16} className="mr-2" />
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleExportPdf}
                                className="flex-1 h-11 border-border bg-card hover:bg-accent text-foreground"
                            >
                                <FileDown size={16} className="mr-2" />
                                PDF
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">📋</div>
                        <p className="text-muted-foreground mb-6">No handover data available</p>
                        <Button onClick={generateHandover}>
                            Generate Handover
                        </Button>
                    </div>
                )}
            </div>

            <TabBar />
        </div>
    )
}
