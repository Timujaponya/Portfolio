import { Languages } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/90 p-1 ${className}`}>
      <span className="px-2 text-slate-500" aria-hidden="true">
        <Languages size={14} />
      </span>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
          language === 'en' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('tr')}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
          language === 'tr' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        TR
      </button>
      <span className="sr-only">{t('lang.switch')}</span>
    </div>
  )
}
