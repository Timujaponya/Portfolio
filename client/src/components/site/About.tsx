import { Code2, Locate, Rocket, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import type { Profile } from '../../types/portfolio'
import { useLanguage } from '../../i18n/LanguageContext'
import { DynamicText } from '../common/DynamicText'

interface AboutProps {
  profile: Profile | null
  projectCount: number
  serviceCount: number
}

export function About({ profile, projectCount, serviceCount }: AboutProps) {
  const { t, language } = useLanguage()

  const cards = [
    {
      icon: Code2,
      title: t('about.card.software.title'),
      description: t('about.card.software.desc'),
    },
    {
      icon: Rocket,
      title: t('about.card.product.title'),
      description: t('about.card.product.desc'),
    },
    {
      icon: Sparkles,
      title: t('about.card.ui.title'),
      description: t('about.card.ui.desc'),
    },
    {
      icon: Locate,
      title: t('about.card.remote.title'),
      description: profile?.location
        ? language === 'tr'
          ? `${profile.location} merkezli, global projelere acigim.`
          : `Based in ${profile.location}, open to global projects.`
        : t('about.card.remote.desc'),
    },
  ]

  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-4xl font-black text-slate-900 sm:text-5xl">{t('about.title')}</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            <DynamicText text={profile?.bio} fallback={t('about.defaultBio')} />
          </p>
        </motion.div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-sky-600 p-3 text-white">
                <card.icon size={20} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 p-8 text-white sm:p-12"
        >
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            <div>
              <p className="text-4xl font-black">{projectCount}+</p>
              <p className="text-sm text-sky-100">{t('about.stats.projects')}</p>
            </div>
            <div>
              <p className="text-4xl font-black">{serviceCount}+</p>
              <p className="text-sm text-sky-100">{t('about.stats.services')}</p>
            </div>
            <div>
              <p className="text-4xl font-black">{profile?.techStack?.length || 0}+</p>
              <p className="text-sm text-sky-100">{t('about.stats.stack')}</p>
            </div>
            <div>
              <p className="text-4xl font-black">24h</p>
              <p className="text-sm text-sky-100">{t('about.stats.response')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
