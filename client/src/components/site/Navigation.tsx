import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '../../i18n/LanguageContext'
import { LanguageToggle } from '../common/LanguageToggle'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.skills'), href: '#skills' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
          {t('nav.brand')}
        </span>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-sky-600"
            >
              {item.label}
            </button>
          ))}
          <LanguageToggle />
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-slate-700 transition-colors hover:text-sky-600 md:hidden"
          aria-label={t('nav.toggleMenu')}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white md:hidden"
          >
            <div className="space-y-2 px-4 py-4 sm:px-6">
              <div className="pb-2">
                <LanguageToggle />
              </div>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full rounded-md px-2 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 hover:text-sky-600"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
