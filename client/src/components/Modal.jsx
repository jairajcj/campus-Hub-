import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, footer }) {
    const backdropRef = useRef()

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', handler)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div
            className="modal-backdrop"
            ref={backdropRef}
            onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
        >
            <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal-head">
                    <h2 className="modal-title" id="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    )
}
