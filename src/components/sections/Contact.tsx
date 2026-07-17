'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import { Send, Mail, MapPin, Clock, MessageSquare, Handshake } from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import MagneticButton from '@/components/ui/MagneticButton'
import SectionLabel from '@/components/ui/SectionLabel'
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/motion'

const VALUE_PROPS = [
  { icon: Clock, key: 'value_response' as const },
  { icon: MessageSquare, key: 'value_consultation' as const },
  { icon: Handshake, key: 'value_contracts' as const },
]

const inputStyles: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: 'white',
  outline: 'none',
  fontSize: '16px', // 16px evita el auto-zoom de iOS Safari al enfocar el campo (dispara con <16px)
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'inherit',
}

function StyledInput({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required,
  'aria-label': ariaLabel,
}: {
  type?: string
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  'aria-label'?: string
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      aria-label={ariaLabel ?? placeholder}
      style={inputStyles}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.1)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      autoComplete={type === 'email' ? 'email' : name === 'name' ? 'name' : 'organization'}
    />
  )
}

function StyledTextarea({
  name,
  placeholder,
  value,
  onChange,
  required,
}: {
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
}) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      aria-label={placeholder}
      rows={5}
      style={{
        ...inputStyles,
        resize: 'vertical',
        minHeight: '120px',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.1)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}

type FormState = {
  name: string
  email: string
  company: string
  message: string
}

export default function Contact() {
  const t = useTranslations('contact')
  const locale = useLocale()

  const [form, setForm] = useState<FormState>({ name: '', email: '', company: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      // Atribución de origen: las landings (/solutions, demos) enlazan a #contact con
      // ?source=…; se persiste en el Lead para medir qué canal convierte. Máx 60 chars (zod).
      const source =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('source')?.slice(0, 60) || undefined
          : undefined
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale, source }),
      })
      if (!res.ok) throw new Error('Request failed')
      toast.success(t('success'))
      setForm({ name: '', email: '', company: '', message: '' })
    } catch {
      toast.error(t('error'))
    } finally {
      setSending(false)
    }
  }

  return (
    // overflow-x-clip, no overflow-hidden — ver AppCostEstimator: `hidden` haría de esta
    // sección el scroll-container del panel `lg:sticky` y le impediría fijarse.
    <section id="contact" className="relative py-24 overflow-x-clip">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 20% 60%, rgba(124,58,237,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT: Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-8 lg:sticky lg:top-24"
          >
            <motion.div variants={slideInLeft}>
              <SectionLabel color="cyan">Contact</SectionLabel>
            </motion.div>

            <motion.h2
              variants={slideInLeft}
              className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-tight"
            >
              <GradientText gradient="primary">{t('title')}</GradientText>
            </motion.h2>

            <motion.p variants={slideInLeft} className="text-white/50 text-lg leading-relaxed">
              {t('subtitle')}
            </motion.p>

            {/* Direct contact info */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <a
                href="mailto:techstackmssaravia@gmail.com"
                className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center group-hover:border-cyan-400/40 transition-colors duration-200">
                  <Mail size={16} />
                </div>
                <span className="text-sm">techstackmssaravia@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-white/40">
                <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <span className="text-sm">{t('location')}</span>
              </div>
            </motion.div>

            {/* Value props */}
            <motion.div variants={staggerContainer} className="space-y-3 pt-2">
              {VALUE_PROPS.map(({ icon: Icon, key }) => (
                <motion.div
                  key={key}
                  variants={fadeInUp}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                    <Icon size={14} className="text-cyan-400" />
                  </div>
                  <span className="text-white/60 text-sm">{t(key)}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div
              className="relative overflow-hidden p-8"
              style={{
                borderRadius: 20,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(120,200,255,0.10)',
              }}
            >
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-white/60 text-xs font-medium tracking-wide uppercase">
                    {t('name')} <span className="text-fuchsia-400">*</span>
                  </label>
                  <StyledInput
                    name="name"
                    placeholder={t('name')}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-white/60 text-xs font-medium tracking-wide uppercase">
                    {t('email')} <span className="text-fuchsia-400">*</span>
                  </label>
                  <StyledInput
                    type="email"
                    name="email"
                    placeholder={t('email')}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label htmlFor="company" className="block text-white/60 text-xs font-medium tracking-wide uppercase">
                    {t('company')}
                  </label>
                  <StyledInput
                    name="company"
                    placeholder={t('company')}
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-white/60 text-xs font-medium tracking-wide uppercase">
                    Message <span className="text-fuchsia-400">*</span>
                  </label>
                  <StyledTextarea
                    name="message"
                    placeholder={t('message')}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    disabled={sending}
                    className="w-full justify-center"
                  >
                    {sending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('sending')}
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        {t('submit')}
                      </>
                    )}
                  </MagneticButton>
                </div>

                <p className="text-center text-white/25 text-xs mt-2">
                  {t('direct')}{' '}
                  <a
                    href="mailto:techstackmssaravia@gmail.com"
                    className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
                  >
                    techstackmssaravia@gmail.com
                  </a>
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
