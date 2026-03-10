import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';

/**
 * Export Options Modal
 * Shown after finalizing a note
 * 
 * @example
 * <ExportModal
 *   isOpen={showExport}
 *   onClose={() => setShowExport(false)}
 *   note={note}
 * />
 */
export default function ExportModal({ isOpen, onClose, note }) {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  if (!isOpen || !note) return null;

  const handleCopyToClipboard = async () => {
    setExporting(true);
    try {
      const content = note.content;
      const text = Object.entries(content)
        .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}:\n${val.replace(/<[^>]*>/g, '')}`)
        .join('\n\n');
      
      await navigator.clipboard.writeText(text);
      
      toast({
        title: 'Copied!',
        description: 'Note copied to clipboard',
        variant: 'success',
      });
      
      onClose();
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleSharePDF = () => {
    // TODO: Generate PDF and share
    toast({
      title: 'PDF Export',
      description: 'This feature is coming soon',
      variant: 'default',
    });
  };

  const handleSendToEHR = () => {
    // TODO: Deep link to EHR app or smart copy
    toast({
      title: 'EHR Integration',
      description: 'Opening smart copy mode...',
      variant: 'default',
    });
    
    // For now, just copy and close
    setTimeout(() => {
      handleCopyToClipboard();
    }, 1000);
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
            onClick={onClose}
          >
            <div
              className="w-full max-w-md bg-background-elevated rounded-2xl border border-border-default shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border-default">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Note Finalized
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose how to export this note
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Patient Info */}
                <Card className="border-border-default bg-background-secondary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {note.patient_name || 'Patient'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {note.patient_hn || 'No HN'} • {note.template_type?.toUpperCase() || 'SOAP'}
                        </p>
                      </div>
                      <Badge variant="success">
                        Finalized
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCopyToClipboard}
                    disabled={exporting}
                    className="w-full h-12 justify-start"
                    variant="primary"
                  >
                    <Copy size={20} className="mr-3" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Copy to Clipboard</p>
                      <p className="text-xs text-muted-foreground">
                        Paste directly into EHR
                      </p>
                    </div>
                  </Button>

                  <Button
                    onClick={handleSendToEHR}
                    disabled={exporting}
                    className="w-full h-12 justify-start"
                    variant="secondary"
                  >
                    <ExternalLink size={20} className="mr-3" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Smart Copy to EHR</p>
                      <p className="text-xs text-muted-foreground">
                        Opens EHR with note ready
                      </p>
                    </div>
                  </Button>

                  <Button
                    onClick={handleSharePDF}
                    disabled={exporting}
                    className="w-full h-12 justify-start"
                    variant="outline"
                  >
                    <Download size={20} className="mr-3" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Export as PDF</p>
                      <p className="text-xs text-muted-foreground">
                        Download or share PDF
                      </p>
                    </div>
                  </Button>
                </div>

                {/* Info Note */}
                <div className="p-4 bg-info/10 border border-info/20 rounded-xl">
                  <p className="text-xs text-info">
                    💡 <strong>Pro tip:</strong> Use Smart Copy to automatically open your EHR app with the note formatted and ready to paste.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
