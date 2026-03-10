import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Check, Loader2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { useToast } from '@/hooks/useToast';

/**
 * Follow-up Enrollment Modal
 * Allows clinicians to enroll patients in LINE Bot follow-up program
 */
export default function FollowUpEnrollmentModal({ isOpen, onClose, patientData, noteId }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: consent, 2: phone, 3: success
    const [consent, setConsent] = useState({
        pdpa: false,
        followup: false,
        dataShare: false,
    });
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleConsentContinue = () => {
        if (!consent.pdpa || !consent.followup) {
            toast({
                title: 'Consent Required',
                description: 'Please agree to the required consents to continue',
                variant: 'warning',
            });
            return;
        }
        setStep(2);
    };

    const handleEnroll = async () => {
        if (!phoneNumber || phoneNumber.length < 9) {
            toast({
                title: 'Invalid Phone Number',
                description: 'Please enter a valid phone number',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            // In production, call the backend API to enroll patient
            // await followupApi.enroll({ noteId, phoneNumber, consent });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setStep(3);
            toast({
                title: 'Patient Enrolled!',
                description: 'Follow-up program started via LINE',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Enrollment Failed',
                description: error.message || 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setConsent({ pdpa: false, followup: false, dataShare: false });
        setPhoneNumber('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-lg bg-background-elevated rounded-2xl border border-border-default shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-border-default bg-background-secondary">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-info to-blue-600 flex items-center justify-center">
                                        <Heart size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">
                                            Patient Follow-up
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            14-day automated monitoring via LINE
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Progress Indicator */}
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    {[1, 2, 3].map((s) => (
                                        <div
                                            key={s}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                s <= step ? 'bg-primary w-6' : 'bg-background-tertiary'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Step 1: Consent */}
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="text-center mb-4">
                                            <h3 className="text-base font-semibold text-white mb-2">
                                                Consent for Follow-up Care
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Patient will receive automated check-ins via LINE for 14 days
                                            </p>
                                        </div>

                                        {/* Benefits */}
                                        <Card className="border-border-default bg-background-secondary mb-4">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <Check size={18} className="text-success mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-foreground">
                                                        Daily health check-ins via LINE messaging
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Check size={18} className="text-success mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-foreground">
                                                        Medication adherence monitoring
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Check size={18} className="text-success mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-foreground">
                                                        Early detection of complications
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Check size={18} className="text-success mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-foreground">
                                                        Direct nurse escalation if needed
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Consent Checkboxes */}
                                        <div className="space-y-3">
                                            <label className="flex items-start gap-3 p-3 rounded-xl bg-background-tertiary border border-border-default cursor-pointer hover:bg-white/5 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={consent.pdpa}
                                                    onChange={(e) => setConsent({ ...consent, pdpa: e.target.checked })}
                                                    className="mt-1 w-4 h-4 rounded border-border-default bg-background-secondary text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-foreground">
                                                    I consent to personal data processing under PDPA
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-3 p-3 rounded-xl bg-background-tertiary border border-border-default cursor-pointer hover:bg-white/5 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={consent.followup}
                                                    onChange={(e) => setConsent({ ...consent, followup: e.target.checked })}
                                                    className="mt-1 w-4 h-4 rounded border-border-default bg-background-secondary text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-foreground">
                                                    I agree to receive automated follow-up messages for 14 days
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-3 p-3 rounded-xl bg-background-tertiary border border-border-default cursor-pointer hover:bg-white/5 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={consent.dataShare}
                                                    onChange={(e) => setConsent({ ...consent, dataShare: e.target.checked })}
                                                    className="mt-1 w-4 h-4 rounded border-border-default bg-background-secondary text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-foreground">
                                                    Allow data sharing with healthcare team for care coordination
                                                </span>
                                            </label>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={handleClose}
                                                className="flex-1 h-11"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleConsentContinue}
                                                className="flex-1 h-11"
                                            >
                                                Continue
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Phone Number */}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="text-center mb-4">
                                            <h3 className="text-base font-semibold text-white mb-2">
                                                LINE Contact Information
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Enter patient's phone number for LINE verification
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    placeholder="08X XXX XXXX"
                                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-default bg-background-secondary text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Patient must have LINE app installed with this phone number
                                            </p>
                                        </div>

                                        {/* LINE Badge */}
                                        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#06C755]/10 border border-[#06C755]/20">
                                            <MessageCircle size={18} className="text-[#06C755]" />
                                            <span className="text-sm font-medium text-[#06C755]">
                                                LINE Bot Integration
                                            </span>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setStep(1)}
                                                className="flex-1 h-11"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                onClick={handleEnroll}
                                                disabled={loading}
                                                className="flex-1 h-11"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin mr-2" />
                                                        Enrolling...
                                                    </>
                                                ) : (
                                                    'Enroll Patient'
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Success */}
                                {step === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/30">
                                            <Check size={40} className="text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">
                                            Patient Enrolled Successfully!
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                                            Patient will receive a LINE message within 24 hours to start the follow-up program
                                        </p>

                                        {/* Follow-up Schedule */}
                                        <Card className="border-border-default bg-background-secondary mb-6">
                                            <CardContent className="p-4">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                    Follow-up Schedule
                                                </p>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[
                                                        { day: 'Day 1', label: 'Welcome' },
                                                        { day: 'Day 3', label: 'Meds' },
                                                        { day: 'Day 7', label: 'Symptoms' },
                                                        { day: 'Day 14', label: 'Complete' },
                                                    ].map((item) => (
                                                        <div key={item.day} className="text-center">
                                                            <Badge variant="outline" className="text-xs mb-1">
                                                                {item.day}
                                                            </Badge>
                                                            <p className="text-xs text-muted-foreground">
                                                                {item.label}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Button
                                            onClick={handleClose}
                                            className="w-full h-11 bg-gradient-to-r from-primary to-primary-hover"
                                        >
                                            Done
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
