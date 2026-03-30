import { Github, Globe, Linkedin, Twitter } from 'lucide-react'
import type { Profile } from '../../types/portfolio'

interface FooterProps {
  profile: Profile | null
}

export function Footer({ profile }: FooterProps) {
  const social = profile?.socialLinks

  return (
    <footer className="bg-slate-950 py-12 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent">
              {'<Timu />'}
            </h3>
            <p className="text-slate-400">
              Modern web urunleri ve yaratıcı deneyimler gelistirmeye odakli portfolio.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#home" className="transition hover:text-white">Home</a></li>
              <li><a href="#about" className="transition hover:text-white">About</a></li>
              <li><a href="#skills" className="transition hover:text-white">Skills</a></li>
              <li><a href="#projects" className="transition hover:text-white">Projects</a></li>
              <li><a href="#contact" className="transition hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold">Connect</h4>
            <div className="flex gap-3">
              {social?.github && (
                <a href={social.github} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-800 p-2.5 transition hover:bg-sky-600">
                  <Github size={18} />
                </a>
              )}
              {social?.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-800 p-2.5 transition hover:bg-sky-600">
                  <Linkedin size={18} />
                </a>
              )}
              {social?.twitter && (
                <a href={social.twitter} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-800 p-2.5 transition hover:bg-sky-600">
                  <Twitter size={18} />
                </a>
              )}
              {social?.website && (
                <a href={social.website} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-800 p-2.5 transition hover:bg-sky-600">
                  <Globe size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} {profile?.name || 'Timuçin'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
