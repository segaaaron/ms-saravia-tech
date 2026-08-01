'use client'
import { useState } from 'react'
import { m } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import {
  Send,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Handshake,
  ShieldCheck,
  FileText,
  UserRoundCheck,
  Globe,
  ArrowRight,
} from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import MagneticButton from '@/components/ui/MagneticButton'
import SectionLabel from '@/components/ui/SectionLabel'
import { Link } from '@/i18n/navigation'
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/motion'
import { track, umamiAttrs } from '@/lib/analytics'

const VALUE_PROPS = [
  { icon: Clock, key: 'value_response' as const },
  { icon: MessageSquare, key: 'value_consultation' as const },
  { icon: Handshake, key: 'value_contracts' as const },
]

// Señales de confianza para vender a US/CA — solo verificables (LLC US real, modelo senior-led,
// timezone nearshore). Sin métricas/logos/testimonios inventados. `timezone` enlaza a /nearshore.
const TRUST_SIGNALS = [
  { icon: ShieldCheck, key: 'trust_llc' as const },
  { icon: FileText, key: 'trust_nda' as const },
  { icon: UserRoundCheck, key: 'trust_senior' as const },
  { icon: Globe, key: 'trust_timezone' as const, href: '/nearshore' as const },
]

// Enums de calificación: el valor enviado es la clave estable (validada por zod en el server);
// el label visible sale de i18n. Mantener en sync con BUDGET_VALUES/PROJECT_TYPE_VALUES en route.ts.
const BUDGET_OPTIONS = ['lt5k', '5k_15k', '15k_50k', '50k_plus', 'not_sure'] as const
const PROJECT_TYPE_OPTIONS = ['saas', 'mobile', 'ai_agent', 'nearshore', 'other'] as const

// <option> hereda el fondo del sistema en el dropdown nativo; forzamos el tema oscuro.
const optionStyle: React.CSSProperties = { background: '#0B0D14', color: 'white' }

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

function StyledSelect({
  name,
  value,
  onChange,
  required,
  'aria-label': ariaLabel,
  children,
}: {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  'aria-label'?: string
  children: React.ReactNode
}) {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      aria-label={ariaLabel}
      style={{ ...inputStyles, cursor: 'pointer' }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.1)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {children}
    </select>
  )
}

type FormState = {
  name: string
  email: string
  company: string
  budget: string
  projectType: string
  message: string
}

export default function Contact() {
  const t = useTranslations('contact')
  const locale = useLocale()

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    budget: '',
    projectType: '',
    message: '',
  })
  const [sending, setSending] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Sin PII: solo señales categóricas. has_company ayuda a distinguir lead B2B de particular.
    const hasCompany = form.company.trim().length > 0
    track('contact-submit', { locale, has_company: hasCompany })
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
      // Conversión: el North-Star del sitio. `source` da el canal (estimator, demos, ad UTM…).
      // budget/projectType son categóricos (no PII) → señal de calidad del lead en el funnel.
      track('lead', {
        locale,
        has_company: hasCompany,
        source: source ?? 'direct',
        budget: form.budget,
        project_type: form.projectType,
      })
      toast.success(t('success'))
      setForm({ name: '', email: '', company: '', budget: '', projectType: '', message: '' })
    } catch {
      track('contact-error', { locale })
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
          <m.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-8 lg:sticky lg:top-24"
          >
            <m.div variants={slideInLeft}>
              <SectionLabel color="cyan">{t('label')}</SectionLabel>
            </m.div>

            <m.h2
              variants={slideInLeft}
              className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-tight"
            >
              <GradientText gradient="primary">{t('title')}</GradientText>
            </m.h2>

            <m.p variants={slideInLeft} className="text-white/50 text-lg leading-relaxed">
              {t('subtitle')}
            </m.p>

            {/* Direct contact info */}
            <m.div variants={fadeInUp} className="space-y-4">
              <a
                href="mailto:techstackmssaravia@gmail.com"
                className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors duration-200 group"
                {...umamiAttrs('email-click', { placement: 'contact-card' })}
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
            </m.div>

            {/* Value props */}
            <m.div variants={staggerContainer} className="space-y-3 pt-2">
              {VALUE_PROPS.map(({ icon: Icon, key }) => (
                <m.div
                  key={key}
                  variants={fadeInUp}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                    <Icon size={14} className="text-cyan-400" />
                  </div>
                  <span className="text-white/60 text-sm">{t(key)}</span>
                </m.div>
              ))}
            </m.div>

            {/* Trust signals — credibilidad para clientes US/CA (LLC, NDA, senior-led, timezone).
                Glass card al estilo de la founder card de About; el ítem de timezone enlaza a /nearshore. */}
            <m.div
              variants={fadeInUp}
              className="rounded-2xl p-6 space-y-4"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(120,200,255,0.14)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2FF5E0]/85">
                {t('trust_label')}
              </p>
              <ul className="space-y-3">
                {TRUST_SIGNALS.map(({ icon: Icon, key, href }) => (
                  <li key={key} className="flex gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-[#2FF5E0]"
                      style={{
                        borderRadius: 10,
                        background: 'rgba(120,200,255,0.06)',
                        border: '1px solid rgba(120,200,255,0.20)',
                      }}
                    >
                      <Icon size={15} strokeWidth={1.6} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-snug text-white/75">{t(key)}</p>
                      {href && (
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1 text-xs text-cyan-400/80 hover:text-cyan-400 transition-colors"
                          {...umamiAttrs('nearshore-click', { placement: 'contact-trust' })}
                        >
                          {t('trust_timezone_link')}
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </m.div>
          </m.div>

          {/* RIGHT: Form */}
          <m.div
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

                {/* Budget + Project type — calificación del lead (obligatorios) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="budget" className="block text-white/60 text-xs font-medium tracking-wide uppercase">
                      {t('budget')} <span className="text-fuchsia-400">*</span>
                    </label>
                    <StyledSelect
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      required
                      aria-label={t('budget')}
                    >
                      <option value="" disabled style={optionStyle}>
                        {t('budget_placeholder')}
                      </option>
                      {BUDGET_OPTIONS.map((o) => (
                        <option key={o} value={o} style={optionStyle}>
                          {t(`budget_options.${o}`)}
                        </option>
                      ))}
                    </StyledSelect>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="projectType" className="block text-white/60 text-xs font-medium tracking-wide uppercase">
                      {t('projectType')} <span className="text-fuchsia-400">*</span>
                    </label>
                    <StyledSelect
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      required
                      aria-label={t('projectType')}
                    >
                      <option value="" disabled style={optionStyle}>
                        {t('projectType_placeholder')}
                      </option>
                      {PROJECT_TYPE_OPTIONS.map((o) => (
                        <option key={o} value={o} style={optionStyle}>
                          {t(`projectType_options.${o}`)}
                        </option>
                      ))}
                    </StyledSelect>
                  </div>
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
                    {...umamiAttrs('email-click', { placement: 'contact-form' })}
                  >
                    techstackmssaravia@gmail.com
                  </a>
                </p>
              </form>
            </div>
          </m.div>

        </div>
      </div>
    </section>
  )
}
