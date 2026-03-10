import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Pill, Calendar, TrendingUp, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import MobileLayout from '@/components/layout/MobileLayout';
import { generateAllMockData, getMockCarePlanForNote } from '@/lib/mockData';

/**
 * Care Plan Page
 * Patient care plans with medications, follow-up, and lifestyle recommendations
 */
export default function CarePlan() {
  const [loading, setLoading] = useState(true);
  const [carePlans, setCarePlans] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePlans: 0,
    medications: 0,
    followUps: 0,
  });

  useEffect(() => {
    loadCarePlans();
  }, []);

  const loadCarePlans = async () => {
    setLoading(true);
    try {
      // Generate mock data for testing
      const mockData = generateAllMockData();
      
      // Create care plans from notes
      const plans = mockData.notes.slice(0, 5).map((note, index) => ({
        id: `careplan-${index + 1}`,
        patient_name: note.patient_name,
        patient_hn: note.patient_hn,
        created_at: note.created_at,
        status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'completed' : 'pending',
        carePlan: getMockCarePlanForNote(note),
      }));
      
      setCarePlans(plans);
      setStats({
        totalPatients: plans.length,
        activePlans: plans.filter(p => p.status === 'active').length,
        medications: plans.reduce((acc, p) => acc + (p.carePlan?.medications?.length || 0), 0),
        followUps: plans.filter(p => p.carePlan?.follow_up).length,
      });
    } catch (error) {
      console.error('Failed to load care plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'secondary';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="safe-top px-6 pt-8 pb-6 relative z-10">
        <h1 className="text-3xl font-bold text-white gradient-text mb-2">
          Care Plans
        </h1>
        <p className="text-muted-foreground text-sm">
          Patient care plans and treatment tracking
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-6 relative z-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border-default bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                    <Users size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalPatients}</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border-default bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-green-600 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.activePlans}</p>
                    <p className="text-xs text-muted-foreground">Active Plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border-default bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-info to-blue-600 flex items-center justify-center">
                    <Pill size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.medications}</p>
                    <p className="text-xs text-muted-foreground">Medications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border-default bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-yellow-600 flex items-center justify-center">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.followUps}</p>
                    <p className="text-xs text-muted-foreground">Follow-ups</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Care Plans List */}
      <div className="px-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            Recent Care Plans
          </h2>
          <Badge variant="secondary" className="text-xs">
            {carePlans.length} plans
          </Badge>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : carePlans.length === 0 ? (
          <Card className="border-border-default bg-card p-8 text-center">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Heart size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Care Plans Yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Care plans are automatically generated when you finalize SOAP notes
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {carePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-border-default bg-card hover:bg-white/5 transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4">
                    {/* Patient Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary-glow/50">
                          <Heart size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {plan.patient_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {plan.patient_hn}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>

                    {/* Medications */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill size={14} className="text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Medications
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.carePlan?.medications?.slice(0, 3).map((med, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {med.name?.split(' ')[0] || 'Medication'}
                          </Badge>
                        ))}
                        {plan.carePlan?.medications?.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{plan.carePlan.medications.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Follow-up */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {plan.carePlan?.follow_up || 'No follow-up scheduled'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-success">
                        <TrendingUp size={12} />
                        <span>On track</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom spacing for tab bar */}
        <div className="h-8" />
      </div>
    </MobileLayout>
  );
}
