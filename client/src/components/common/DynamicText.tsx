import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

interface DynamicTextProps {
  text?: string | null
  fallback?: string
}

export function DynamicText({ text, fallback = '' }: DynamicTextProps) {
  const { language, translateText } = useLanguage()
  const rawText = String(text || fallback || '')
  const [translatedText, setTranslatedText] = useState(rawText)

  useEffect(() => {
    let isMounted = true

    const translate = async () => {
      const value = await translateText(rawText)
      if (isMounted) {
        setTranslatedText(value)
      }
    }

    void translate()

    return () => {
      isMounted = false
    }
  }, [rawText, language, translateText])

  return <>{translatedText}</>
}
