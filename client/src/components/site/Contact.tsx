import { LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import type { Profile } from '../../types/portfolio'
import { FeedbackCard } from '../common/FeedbackCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface ContactProps {
  profile: Profile | null
}

export function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const contentType = res.headers.get('content-type') || ''
      const payload = contentType.includes('application/json') ? await res.json() : null

      if (!res.ok) {
        setSubmitResult({
          type: 'error',
          message: payload?.message || 'Mesaj gonderilemedi. Lutfen tekrar deneyin.',
        })
        return
      }

      setSubmitResult({
        type: 'success',
        message: payload?.message || 'Mesajiniz alindi. En kisa surede donus yapacagim.',
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Contact form submit error:', error)
      setSubmitResult({
        type: 'error',
        message: 'Baglanti hatasi olustu. Lutfen daha sonra tekrar deneyin.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-4xl font-black text-slate-900 sm:text-5xl">Get In Touch</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Yeni bir urun fikri, mevcut bir projede destek veya freelance is birligi icin iletisime gecebilirsin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Contact Information</h3>
              <p className="text-slate-600">Ortalama 24 saat icinde geri donus yapiyorum.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl bg-white p-4">
                <div className="rounded-lg bg-sky-600 p-3 text-white">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email</p>
                  <a href={`mailto:${profile?.email || ''}`} className="text-slate-600 hover:text-sky-600">
                    {profile?.email || 'mail@example.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-white p-4">
                <div className="rounded-lg bg-sky-600 p-3 text-white">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone</p>
                  <a href={`tel:${profile?.phone || ''}`} className="text-slate-600 hover:text-sky-600">
                    {profile?.phone || 'Not specified'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-white p-4">
                <div className="rounded-lg bg-sky-600 p-3 text-white">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Location</p>
                  <p className="text-slate-600">{profile?.location || 'Remote'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-5 rounded-2xl bg-white p-8 shadow-lg shadow-slate-100"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
              placeholder="Subject"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              placeholder="Message"
              rows={5}
              required
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-7 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              {isSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={17} />}
            </button>

            <AnimatePresence mode="wait">
              {submitResult && (
                <motion.div
                  key={submitResult.type + submitResult.message}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <FeedbackCard
                    tone={submitResult.type}
                    title={submitResult.type === 'success' ? 'Mesaj gonderildi' : 'Mesaj gonderilemedi'}
                    message={submitResult.message}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
