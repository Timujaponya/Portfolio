import { Download, Github, Globe, Linkedin, Mail, Twitter } from 'lucide-react'
import { motion } from 'motion/react'
import type { Profile } from '../../types/portfolio'
import { resolveMediaUrl } from '../../utils/mediaUrl'
import { useLanguage } from '../../i18n/LanguageContext'
import { DynamicText } from '../common/DynamicText'

interface HeroProps {
  profile: Profile | null
}

export function Hero({ profile }: HeroProps) {
  const social = profile?.socialLinks
  const avatarUrl = resolveMediaUrl(profile?.avatarUrl)
  const cvUrl = resolveMediaUrl(profile?.cvUrl)
  const { t } = useLanguage()

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0,#ffffff_42%),radial-gradient(circle_at_85%_15%,#e0e7ff_0,#ffffff_45%),linear-gradient(180deg,#f8fafc_0,#ffffff_100%)] pt-16"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            {t('hero.badge')}
          </p>
          <h1 className="mb-6 text-5xl font-black leading-tight text-slate-900 sm:text-6xl lg:text-7xl">
            {t('hero.greeting')}{' '}
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              <DynamicText text={profile?.name} fallback={t('hero.defaultName')} />
            </span>
          </h1>
          <p className="mb-2 text-xl text-slate-700 sm:text-2xl">
            <DynamicText text={profile?.title} fallback={t('hero.defaultTitle')} />
          </p>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            <DynamicText text={profile?.bio} fallback={t('hero.defaultBio')} />
          </p>

          <div className="mb-8 flex flex-wrap gap-4">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-7 py-3 font-semibold text-white shadow-lg shadow-sky-200 transition-colors hover:bg-sky-700"
            >
              {t('hero.ctaContact')}
              <Mail size={18} />
            </motion.a>
            {cvUrl && (
              <motion.a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-sky-600 px-7 py-3 font-semibold text-sky-700 transition-colors hover:bg-sky-50"
              >
                {t('hero.ctaCv')}
                <Download size={18} />
              </motion.a>
            )}
          </div>

          <div className="flex gap-3">
            {social?.github && (
              <a href={social.github} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200">
                <Github size={18} />
              </a>
            )}
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200">
                <Linkedin size={18} />
              </a>
            )}
            {social?.twitter && (
              <a href={social.twitter} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200">
                <Twitter size={18} />
              </a>
            )}
            {social?.website && (
              <a href={social.website} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200">
                <Globe size={18} />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-r from-sky-300/40 to-indigo-300/40 blur-2xl" />
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-white p-2 shadow-2xl">
            {avatarUrl ? (
              <img src={avatarUrl} alt={profile?.name || 'Profile'} className="h-full w-full rounded-[1.5rem] object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-100 to-indigo-100 text-7xl">
                👨‍💻
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
