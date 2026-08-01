export const projects = [
  {
    id: 'yasmin',
    title: 'Yasmin Medrano',
    category: 'Aesthetic Medical Clinic',
    desc: 'Complete digital presence for a premium aesthetic medicine practice.',
    url: 'https://yasminmedrano.com',
    status: 'live' as const,
    color: '#7C3AED',
  },
  {
    id: 'readycv',
    title: 'ReadyCV',
    category: 'AI Resume Builder',
    desc: 'AI-powered resume builder helping professionals land their dream jobs.',
    url: 'https://www.valhallaresume.com',
    status: 'live' as const,
    color: '#00E5FF',
  },
  {
    id: 'nova',
    title: 'NOVA Nutrition',
    category: 'iOS & Android App',
    desc: 'Smart nutrition tracking powered by AI. Coming soon.',
    url: null,
    status: 'soon' as const,
    color: '#FF2BD6',
  },
] as const

export type Project = (typeof projects)[number]
