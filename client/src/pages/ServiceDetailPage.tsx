import { ArrowLeft, CircleDollarSign } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FeedbackCard } from '../components/common/FeedbackCard'
import { DynamicText } from '../components/common/DynamicText'
import { IconValue } from '../components/common/IconValue'
import { LanguageToggle } from '../components/common/LanguageToggle'
import { useLanguage } from '../i18n/LanguageContext'
import type { Service } from '../types/portfolio'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface ServiceDetailPageProps {
  serviceId: string
}

export default function ServiceDetailPage({ serviceId }: ServiceDetailPageProps) {
  const { t } = useLanguage()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigateToSkills = () => {
    window.history.pushState({}, '', '/#skills')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigateToContact = () => {
    window.history.pushState({}, '', '/#contact')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  useEffect(() => {
    let cancelled = false

    const loadService = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`${API_URL}/services/${encodeURIComponent(serviceId)}`)
        const data = await res.json()

        if (!res.ok || !data?.service) {
          throw new Error(data?.message || 'SERVICE_NOT_FOUND')
        }

        if (!cancelled) {
          setService(data.service)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'SERVICE_LOAD_ERROR')
          setService(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadService()

    return () => {
      cancelled = true
    }
  }, [serviceId])

  const hasPrice = Boolean(service?.price && (service.price.min != null || service.price.max != null))
  const errorMessage =
    error === 'SERVICE_NOT_FOUND'
      ? t('serviceDetail.error.notFound')
      : error === 'SERVICE_LOAD_ERROR'
        ? t('serviceDetail.error.generic')
        : error

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={navigateToSkills}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            <ArrowLeft size={16} />
            {t('serviceDetail.back')}
          </button>
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <FeedbackCard tone="info" title={t('serviceDetail.loading.title')} message={t('serviceDetail.loading.message')} />
        ) : error ? (
          <FeedbackCard tone="error" title={t('serviceDetail.error.title')} message={errorMessage} />
        ) : service ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-8 sm:p-10">
              <div className="mb-5 inline-flex items-center justify-center rounded-2xl border border-sky-200 bg-white p-4 text-sky-700 shadow-sm">
                <IconValue value={service.icon} size={30} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                <DynamicText text={service.title} fallback={service.title} />
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                <DynamicText text={service.description} fallback={service.description} />
              </p>
            </div>

            <div className="space-y-8 p-8 sm:p-10">
              {hasPrice ? (
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="mb-3 text-xl font-bold text-slate-900">{t('serviceDetail.price.title')}</h2>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-slate-700 shadow-sm">
                    <CircleDollarSign size={18} />
                    <span className="font-semibold">
                      {service.price.min} - {service.price.max} {service.price.currency}
                    </span>
                  </div>
                </section>
              ) : null}

              <section>
                <h2 className="mb-4 text-xl font-bold text-slate-900">{t('serviceDetail.features.title')}</h2>
                {service.features && service.features.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {service.features.map((feature, index) => (
                      <li key={`${feature.text}-${index}`} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                          <IconValue value={feature.icon || 'faCheck'} size={14} />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700">
                          <DynamicText text={feature.text} fallback={feature.text} />
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <FeedbackCard tone="info" message={t('serviceDetail.features.empty')} compact />
                )}
              </section>

              <section className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-6">
                <h2 className="text-xl font-bold text-slate-900">{t('serviceDetail.cta.title')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('serviceDetail.cta.description')}</p>
                <button
                  type="button"
                  onClick={navigateToContact}
                  className="mt-4 inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  {t('serviceDetail.cta.button')}
                </button>
              </section>
            </div>
          </motion.section>
        ) : null}
      </main>
    </div>
  )
}
