import { motion } from 'motion/react'
import type { Profile, Service } from '../../types/portfolio'
import { FeedbackCard } from '../common/FeedbackCard'
import { DynamicText } from '../common/DynamicText'
import { useLanguage } from '../../i18n/LanguageContext'
import { IconValue } from '../common/IconValue'

interface SkillsProps {
  profile: Profile | null
  services: Service[]
}

export function Skills({ profile, services }: SkillsProps) {
  const { t } = useLanguage()
  const techStack = profile?.techStack || []

  return (
    <section id="skills" className="bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-4xl font-black text-slate-900 sm:text-5xl">{t('skills.title')}</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 shadow-lg shadow-slate-100"
          >
            <h3 className="mb-6 text-2xl font-bold text-slate-900">{t('skills.techStack')}</h3>
            <div className="flex flex-wrap gap-3">
              {techStack.length ? (
                techStack.map((tech) => (
                  <span
                    key={`${tech.name}-${tech.icon || 'default'}`}
                    className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700"
                  >
                    <IconValue value={tech.icon} size={14} />
                    <DynamicText text={tech.name} fallback={tech.name} />
                  </span>
                ))
              ) : (
                <FeedbackCard tone="info" title={t('skills.techStack')} message={t('skills.empty.tech')} className="w-full" compact />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 shadow-lg shadow-slate-100"
          >
            <h3 className="mb-6 text-2xl font-bold text-slate-900">{t('skills.serviceFocus')}</h3>
            <div className="space-y-4">
              {services.length ? (
                services.map((service) => (
                  <article key={service._id} className="rounded-xl border border-slate-200 p-4">
                    <p className="font-bold text-slate-900">
                      <DynamicText text={service.title} fallback={service.title} />
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      <DynamicText text={service.description} fallback={service.description} />
                    </p>
                  </article>
                ))
              ) : (
                <FeedbackCard tone="info" title={t('skills.serviceFocus')} message={t('skills.empty.service')} compact />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
