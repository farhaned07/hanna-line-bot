import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * ⌨️ Global Keyboard Shortcuts for Hanna Scribe
 * 
 * Shortcuts:
 * - Cmd/Ctrl + N = New session
 * - Cmd/Ctrl + S = Save note (in editor)
 * - Cmd/Ctrl + E = Export PDF (in note view)
 * - Cmd/Ctrl + F = Focus search (in home)
 * - Cmd/Ctrl + K = AI commands (in editor)
 * - Cmd/Ctrl + H = Go to Handover
 * - Cmd/Ctrl + , = Go to Settings
 * - Esc = Back/Cancel
 * - ? = Show shortcuts (future)
 */

export function useKeyboardShortcuts({ 
    onSave, 
    onExport, 
    onAICommand,
    onNewSession 
} = {}) {
    const navigate = useNavigate()

    const handleKeyDown = useCallback((e) => {
        // Ignore if typing in input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            // Except for Cmd+S, Cmd+E which should always work
            if (!(e.metaKey || e.ctrlKey)) return
        }

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
        const modifier = isMac ? e.metaKey : e.ctrlKey
        const key = e.key.toLowerCase()

        // Cmd/Ctrl + N = New session
        if (modifier && key === 'n') {
            e.preventDefault()
            onNewSession?.()
            navigate('/scribe/app') // Go to home where FAB is
            return
        }

        // Cmd/Ctrl + S = Save
        if (modifier && key === 's') {
            e.preventDefault()
            onSave?.()
            return
        }

        // Cmd/Ctrl + E = Export PDF
        if (modifier && key === 'e') {
            e.preventDefault()
            onExport?.()
            return
        }

        // Cmd/Ctrl + K = AI Commands
        if (modifier && key === 'k') {
            e.preventDefault()
            onAICommand?.()
            // Focus will be handled by the editor component
            return
        }

        // Cmd/Ctrl + F = Focus search (home page)
        if (modifier && key === 'f') {
            e.preventDefault()
            const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]')
            searchInput?.focus()
            return
        }

        // Cmd/Ctrl + H = Handover
        if (modifier && key === 'h') {
            e.preventDefault()
            navigate('/handover')
            return
        }

        // Cmd/Ctrl + , = Settings
        if (modifier && key === ',') {
            e.preventDefault()
            navigate('/settings')
            return
        }

        // Esc = Back (if not in modal)
        if (key === 'escape') {
            e.preventDefault()
            // Check if any modal/dialog is open
            const modal = document.querySelector('[role="dialog"], .modal, [class*="modal"]')
            if (modal) {
                // Close modal instead
                const closeButton = modal.querySelector('button')
                closeButton?.click()
            } else {
                // Go back
                navigate(-1)
            }
            return
        }
    }, [navigate, onSave, onExport, onAICommand, onNewSession])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}

// Export a hook for component-specific shortcuts
export function useNoteEditorShortcuts(onSave, onFinalize) {
    useKeyboardShortcuts({
        onSave: onSave,
        onExport: () => {
            // Trigger PDF export
            const pdfButton = document.querySelector('[onclick*="downloadPdf"]')
            pdfButton?.click()
        },
        onAICommand: () => {
            // Focus AI command input
            const commandInput = document.querySelector('input[placeholder*="Hanna"]')
            commandInput?.focus()
        },
        onFinalize: onFinalize
    })
}
