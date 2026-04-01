import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

export type FeedbackTone = 'success' | 'error' | 'info' | 'warning'

interface FeedbackCardProps {
  tone?: FeedbackTone
  title?: ReactNode
  message: ReactNode
  className?: string
  compact?: boolean
  icon?: ReactNode
}

const toneStyles: Record<FeedbackTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
}

const toneIcons: Record<FeedbackTone, ReactNode> = {
  success: <CircleCheck size={18} />,
  error: <CircleAlert size={18} />,
  info: <Info size={18} />,
  warning: <TriangleAlert size={18} />,
}

export function FeedbackCard({ tone = 'info', title, message, className = '', compact = false, icon }: FeedbackCardProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${compact ? 'text-xs sm:text-sm' : 'text-sm'} ${toneStyles[tone]} ${className}`}
    >
      <div className="mt-0.5 shrink-0">{icon || toneIcons[tone]}</div>
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <p className={title ? 'mt-0.5' : ''}>{message}</p>
      </div>
    </div>
  )
}
