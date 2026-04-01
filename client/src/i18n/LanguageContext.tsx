import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { translationMap, type Language } from './translations'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const STORAGE_KEY = 'portfolio-language'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, fallback?: string) => string
  translateText: (text: string) => Promise<string>
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'tr' || stored === 'en') {
    return stored
  }

  const browserLanguage = navigator.language.toLowerCase()
  return browserLanguage.startsWith('tr') ? 'tr' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage())
  const cacheRef = useRef<Map<string, string>>(new Map())

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'tr' : 'en')
  }, [language, setLanguage])

  const t = useCallback(
    (key: string, fallback?: string) => {
      return translationMap[language][key] || fallback || key
    },
    [language],
  )

  const translateText = useCallback(
    async (text: string) => {
      const normalizedText = String(text || '').trim()
      if (!normalizedText) {
        return normalizedText
      }

      const cacheKey = `${language}::${normalizedText}`
      const cached = cacheRef.current.get(cacheKey)
      if (cached) {
        return cached
      }

      try {
        const res = await fetch(`${API_URL}/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetLang: language,
            texts: [normalizedText],
          }),
        })

        if (!res.ok) {
          return normalizedText
        }

        const data = (await res.json()) as { translations?: string[] }
        const translated = data.translations?.[0] || normalizedText
        cacheRef.current.set(cacheKey, translated)
        return translated
      } catch {
        return normalizedText
      }
    },
    [language],
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      translateText,
    }),
    [language, setLanguage, toggleLanguage, t, translateText],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
