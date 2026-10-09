import { useState, useEffect, useRef } from 'react'
import {
  Mail, ExternalLink, Menu, X,
  Globe, ChevronDown, Terminal, Layers, Sun, Moon
} from 'lucide-react'
import profileImg from './img/img.png'
import catinhoImg from './img/img-3d.png'
import img01 from './img/img-01.png'
import img02 from './img/img-02.png'

// ─── Icons ────────────────────────────────────────────────────────────────────

function GithubIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

function LinkedinIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FigmaIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5zM12 2h3.5a3.5 3.5 0 110 7H12V2zM12 12.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM5 19.5A3.5 3.5 0 018.5 16H12v3.5a3.5 3.5 0 01-7 0zM5 12.5A3.5 3.5 0 018.5 9H12v7H8.5A3.5 3.5 0 015 12.5z" />
    </svg>
  )
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

type Lang = 'pt' | 'en'

const TRANSLATIONS = {
  pt: {
    nav: ['Início', 'Sobre Mim', 'Trajetória', 'Habilidades', 'Projetos', 'Contato'],
    navHrefs: ['#hero', '#sobre', '#trajetoria', '#habilidades', '#projetos', '#contato'],
    heroGreeting: 'Olá, mundo. Eu sou',
    heroRole: 'Desenvolvedora de Software · ADS',
    heroDesc: 'Apaixonada por transformar ideias em código limpo, interfaces elegantes e soluções que fazem diferença. Em formação e em constante evolução.',
    heroCta: 'Ver Projetos',
    heroContact: 'Entre em Contato',
    aboutTag: '// sobre-mim',
    aboutTitle: 'Sobre Mim',
    aboutP1: 'Sou uma desenvolvedora de software em formação, cursando',
    aboutCourse: 'Análise e Desenvolvimento de Sistemas',
    aboutP1End: '. Minha jornada na tecnologia começou pela curiosidade de entender como as coisas funcionam por trás das telas — e isso se tornou uma paixão.',
    aboutP2Start: 'Tenho experiência prática com desenvolvimento web, trabalhando com tecnologias como',
    aboutP2Tech: 'React, JavaScript, HTML, CSS, PHP',
    aboutP2End: '. Acredito que bom código é aquele que resolve problemas reais de forma elegante e sustentável.',
    aboutP3: 'Meu objetivo é construir uma carreira sólida como desenvolvedora web completa, contribuindo para projetos que gerem impacto positivo e que desafiem meu crescimento técnico a cada dia.',
    aboutCards: ['Interfaces', 'Sistemas', 'Versionamento', 'Design'],
    aboutCardVals: ['React & JS', 'PHP', 'Git & GitHub', 'Figma & UX'],
    timelineTag: '// trajetoria',
    timelineTitle: 'Minha Trajetória',
    timelineSub: 'Uma linha do tempo da minha evolução na tecnologia.',
    timeline: [
       { title: 'Ensino Superior', desc: 'Formação em Análise e Desenvolvimento de Sistemas, com foco em programação e desenvolvimento de software (2024-2026).' },

      { title: 'Ensino técnico Senac-DF', desc: 'Formação técnica em desenvolvimento de software, com foco em suporte técnico e programação (2024-2025).' },
      { title: 'Jovem Aprendiz-G4F', desc: 'Atuação em ambiente de trabalho, desenvolvendo habilidades técnicas e profissionais. (2026)' },

    ],
    skillsTag: '// habilidades',
    skillsTitle: 'Tecnologias e Ferramentas',
    skillsSub: 'Tecnologias com as quais trabalho e estou continuamente evoluindo.',
    projectsTag: '// projetos',
    projectsTitle: 'Projetos',
    projectsSub: 'Trabalhos desenvolvidos durante minha jornada de aprendizado na Instituição Senac-DF, no curso de Desenvolvimento de Software.',
    projectDemo: 'Demonstração',
    projects: [
      { title: 'Curso Desenvolvimento Web – Senac', desc: 'Projeto desenvolvido durante o curso de Desenvolvimento Web do Senac-DF, colocando em prática conceitos de criação de aplicações web eficientes e funcionais.' },
      { title: 'Curso Técnico em Desenvolvimento de Sistemas – Senac', desc: 'Primeira versão do portfólio pessoal desenvolvido com HTML, CSS e JavaScript puro, com design responsivo.' },
    ],
    educationTag: '// formacao',
    educationTitle: 'Formação',
    educationSub: 'Educação formal, cursos e certificações que moldaram meu conhecimento.',
    education: [
      { type: 'Graduação', title: 'Análise e Desenvolvimento de Sistemas', institution: 'Instituição de Ensino Superior', period: '2023 – 2025', desc: 'Formação técnica em desenvolvimento de software, banco de dados, engenharia de software e gestão de projetos.' },
      { type: 'Curso', title: 'React do Zero ao Avançado', institution: 'Plataforma Online', period: '2024', desc: 'Fundamentos do React, hooks, context API, roteamento e integração com APIs REST.' },
      { type: 'Certificação', title: 'Python para Data Science e Machine Learning', institution: 'Plataforma Online', period: '2024', desc: 'Pandas, NumPy, Matplotlib, Scikit-Learn e projetos práticos com dados reais.' },
      { type: 'Curso', title: 'Fundamentos de UX/UI com Figma', institution: 'Plataforma Online', period: '2023', desc: 'Princípios de design de interface, prototipagem e componentização no Figma.' },
    ],
    contactTag: '// contato',
    contactTitle: 'Entre em Contato',
    contactSub: 'Vamos conversar sobre projetos, oportunidades ou colaborações.',
    contactDesc: 'Estou sempre aberta a novas conexões, oportunidades de aprendizado e colaborações criativas. Me encontre nas redes abaixo ou envie uma mensagem direto pelo formulário.',
    contactHeading: 'Vamos conversar?',
    contactIntro: 'Estou aberta a oportunidades de estágio e a projetos em suporte, desenvolvimento e dados.',
    contactTerminalLines: ['abrindo chamado...', 'técnica disponível', 'aguardando sua mensagem'],
    copyEmail: 'Copiar e-mail',
    copiedEmail: 'Copiado!',
    formName: 'Layanne Sousa',
    formEmail: 'Seu e-mail',
    formSubject: 'Assunto',
    formMessage: 'Sua mensagem...',
    formSend: 'Enviar Mensagem',
    formSent: '✓ Mensagem enviada!',
    footer: '© 2026 lay · Feito com ❤️ e muito café',
    toggleTheme: 'Alternar modo',
  },
  en: {
    nav: ['Home', 'About', 'Journey', 'Skills', 'Projects', 'Contact'],
    navHrefs: ['#hero', '#sobre', '#trajetoria', '#habilidades', '#projetos', '#contato'],
    heroGreeting: 'Hello, world. I am',
    heroRole: 'Software Developer · CS',
    heroDesc: 'Passionate about turning ideas into clean code, elegant interfaces and solutions that make a difference. Always learning and growing.',
    heroCta: 'View Projects',
    heroContact: 'Get in Touch',
    aboutTag: '// about-me',
    aboutTitle: 'About Me',
    aboutP1: "I'm a software developer in training, studying",
    aboutCourse: 'Systems Analysis and Development',
    aboutP1End: '. My journey in tech started with curiosity about how things work behind the screens — and it became a passion.',
    aboutP2Start: 'I have hands-on experience in web development, working with technologies like',
    aboutP2Tech: 'React, JavaScript, HTML, CSS, PHP',
    aboutP2End: '. I believe good code is one that solves real problems elegantly and sustainably.',
    aboutP3: 'My goal is to build a solid career as a full stack developer, contributing to projects that generate positive impact and challenge my technical growth every day.',
    aboutCards: ['Front-end', 'Back-end', 'Version Control', 'Design'],
    aboutCardVals: ['React & JS', 'PHP', 'Git & GitHub', 'Figma & UX'],
    timelineTag: '// journey',
    timelineTitle: 'My Journey',
    timelineSub: 'A timeline of my evolution in technology.',
    timeline: [
      { title: 'IT Intern', desc: 'Unicef — GLPI ticket handling, configuration of Linux and Windows machines, lab maintenance and Chromebook lending.' },
      { title: 'Commercial Assistant', desc: 'Colégio Logosschools — Customer and family support, sales assistance and service engagement.' },
      { title: 'Receptionist', desc: 'Dasa — Front desk support and public service.' },
    ],
    skillsTag: '// skills',
    skillsTitle: 'Stack & Tools',
    skillsSub: 'Technologies I work with and continuously improve.',
    projectsTag: '// projects',
    projectsTitle: 'Projects',
    projectsSub: 'Work developed during my learning journey.',
    projectDemo: 'Demo',
    projects: [
      { title: 'Senac Web Development Course', desc: 'Project developed during Senac-DF’s Web Development course, applying concepts for building efficient and functional web applications.' },
      { title: 'Senac Systems Development Technical Course', desc: 'First version of the personal portfolio built with HTML, CSS and plain JavaScript, with responsive design.' },
    ],
    educationTag: '// education',
    educationTitle: 'Education',
    educationSub: 'Formal education, courses and certifications that shaped my knowledge.',
    education: [
      { type: 'Degree', title: 'Systems Analysis and Development', institution: 'Higher Education Institution', period: '2023 – 2025', desc: 'Technical training in software development, databases, software engineering and project management.' },
      { type: 'Course', title: 'React Zero to Advanced', institution: 'Online Platform', period: '2024', desc: 'React fundamentals, hooks, context API, routing and REST API integration.' },
      { type: 'Certificate', title: 'Python for Data Science and Machine Learning', institution: 'Online Platform', period: '2024', desc: 'Pandas, NumPy, Matplotlib, Scikit-Learn and practical projects with real data.' },
      { type: 'Course', title: 'UX/UI Fundamentals with Figma', institution: 'Online Platform', period: '2023', desc: 'Interface design principles, prototyping and componentization in Figma.' },
    ],
    contactTag: '// contact',
    contactTitle: 'Get in Touch',
    contactSub: "Let's talk about projects, opportunities or collaborations.",
    contactDesc: "I'm always open to new connections, learning opportunities and creative collaborations. Find me on the networks below or send a message directly through the form.",
    contactHeading: "Let's talk?",
    contactIntro: "I'm open to internship opportunities and projects in support, software development, and data.",
    contactTerminalLines: ['opening ticket...', 'technician available', 'waiting for your message'],
    copyEmail: 'Copy email',
    copiedEmail: 'Copied!',
    formName: 'Your name',
    formEmail: 'Your e-mail',
    formSubject: 'Subject',
    formMessage: 'Your message...',
    formSend: 'Send Message',
    formSent: '✓ Message sent!',
    footer: '© 2026 lay · Made with ❤️ and lots of coffee',
    toggleTheme: 'Toggle theme',
  },
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SKILLS = [
  { name: 'HTML5', icon: '⟨/⟩', level: 85, color: '#e2712a' },
  { name: 'Tailwind CSS', icon: '〰', level: 80, color: '#38bdf8' },
  { name: 'JavaScript', icon: 'JS', level: 78, color: '#f7df1e' },
  { name: 'PHP', icon: '🐘', level: 70, color: '#777bb4' },
  { name: 'MySQL', icon: '🐬', level: 75, color: '#00758f' },
  { name: 'IA Training', icon: 'Ai', level: 65, color: '#ff9a00' },
  { name: 'Git', icon: '⎇', level: 80, color: '#f14e32' },
  { name: 'GitHub', icon: '⊙', level: 82, color: '#a78bfa' },
  { name: 'VS Code', icon: '⌨', level: 90, color: '#007acc' },
]

const TIMELINE_ICONS = [Terminal, Layers, Globe]
const TIMELINE_YEARS = ['atual', '02/2026 - 04/2026', '06/2025 - 02/2026']

const PROJECT_IMAGES = [
  img01,
  img02,
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=360&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=360&fit=crop&auto=format',
]

const PROJECT_TECHS = [
  ['React', 'JavaScript', 'CSS'],
  ['HTML', 'CSS', 'JavaScript'],
]

const PROJECT_LIVE = [true, true]
const PROJECT_DEMO_LINKS = [
  'https://sintex.infinityfree.me',
  'https://championssports.infinityfree.me',
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

function useTheme() {
  const [light, setLight] = useState(false)
  const toggle = () => {
    setLight(v => {
      document.documentElement.classList.toggle('light', !v)
      return !v
    })
  }
  return { light, toggle }
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Section({ id, children, alt = false }: { id: string; children: React.ReactNode; alt?: boolean }) {
  return (
    <section
      id={id}
      className="py-24 px-6 md:px-12 lg:px-24"
      style={alt ? { backgroundColor: 'var(--card-bg)' } : undefined}
    >
      {children}
    </section>
  )
}

function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-16 text-center">
      <span className="font-display text-xs tracking-widest text-indigo-400 uppercase mb-3 block">{tag}</span>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
      <div className="mt-6 mx-auto w-16 h-px bg-linear-to-r from-indigo-500 to-violet-500" />
    </div>
  )
}

// ─── Lang Switcher ────────────────────────────────────────────────────────────

function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const langs: Lang[] = ['pt', 'en']
  return (
    <div
      role="group"
      aria-label="Idioma"
      className="flex items-center gap-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-0.5"
    >
      {langs.map(l => (
        <button
          key={l}
          type="button"
          data-lang={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`font-display text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${lang === l
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
            : 'text-gray-400 hover:text-indigo-300'
            }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  light, toggleTheme, lang, setLang, t,
}: {
  light: boolean
  toggleTheme: () => void
  lang: Lang
  setLang: (l: Lang) => void
  t: typeof TRANSLATIONS.pt
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-md border-b border-indigo-500/10' : 'bg-transparent'
        }`}
      style={scrolled ? { backgroundColor: 'var(--nav-bg)' } : undefined}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); handleNav('#hero') }}
          className="font-display text-sm text-indigo-400 tracking-wider hover:text-indigo-300 transition-colors"
        >
          &lt;dev.portfolio /&gt;
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {t.nav.map((label, i) => (
            <li key={t.navHrefs[i]}>
              <button
                onClick={() => handleNav(t.navHrefs[i])}
                className="nav-link font-display text-xs tracking-wide transition-colors cursor-pointer"
                style={{ color: 'var(--gray-text)' }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <LangSwitcher lang={lang} setLang={setLang} />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={t.toggleTheme}
            className="p-2 rounded-lg border border-indigo-500/20 text-indigo-400 hover:border-indigo-500/50 hover:text-indigo-300 transition-all duration-300"
          >
            {light ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden transition-colors"
            style={{ color: 'var(--gray-text)' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden backdrop-blur-md border-t border-indigo-500/10" style={{ backgroundColor: 'var(--card-bg)' }}>
          <ul className="flex flex-col py-4">
            {t.nav.map((label, i) => (
              <li key={t.navHrefs[i]}>
                <button
                  onClick={() => handleNav(t.navHrefs[i])}
                  className="w-full text-left px-6 py-3 font-display text-xs tracking-wide hover:bg-indigo-500/5 transition-colors cursor-pointer"
                  style={{ color: 'var(--gray-text)' }}
                >
                  {label}
                </button>
              </li>
            ))}
            <li className="px-6 pt-2 pb-3">
              <LangSwitcher lang={lang} setLang={setLang} />
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function CatImage() {
  return (
    <div className="w-full h-full flex items-center justify-center p-3 relative z-0 animate-breathe">
      <img
        src={catinhoImg}
        alt="Gatinho"
        className="cat-head w-full h-full object-contain drop-shadow-[0_0_28px_rgba(99,102,241,0.6)]"
      />
    </div>
  )
}

function Hero({ t }: { t: typeof TRANSLATIONS.pt }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden pt-16"
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <span className="inline-block font-display text-xs tracking-widest text-indigo-400 uppercase animate-fade-in">
            {t.heroGreeting}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-up">
            Layanne Sousa<span className="gradient-text">.</span>
          </h1>
          <p className="font-display text-sm md:text-base text-indigo-300 tracking-wide animate-fade-in-up delay-100">
            {t.heroRole}
          </p>
          <p className="text-gray-400 text-lg leading-relaxed max-w-lg animate-fade-in-up delay-200">
            {t.heroDesc}
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
            <button
              onClick={() => document.querySelector('#projetos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
            >
              {t.heroCta}
            </button>
            <button
              onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg border border-indigo-500/30 text-indigo-300 font-medium text-sm hover:border-indigo-400/60 hover:text-white transition-all duration-300 hover:bg-indigo-500/5"
            >
              {t.heroContact}
            </button>
          </div>

          <div className="flex gap-4 justify-center lg:justify-start animate-fade-in-up delay-400">
            {[
              { icon: GithubIcon, href: '#', label: 'GitHub' },
              { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
              { icon: Mail, href: '#', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} className="p-2 text-gray-500 hover:text-indigo-400 transition-colors">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="relative animate-float w-full max-w-[400px] mx-auto lg:mx-0">
          <div className="stage" id="stage" style={{ position: 'relative', width: '100%', aspectRatio: '628/500' }}>
            <div className="bubble absolute -top-8 left-0 right-0 text-center bg-indigo-900/50 text-indigo-100 p-3 rounded-2xl text-sm backdrop-blur-sm border border-indigo-500/30 shadow-lg z-10" id="bubble" aria-live="polite">
              Já tentou desligar e ligar de novo? 😄
            </div>
            <CatImage />
            <div className="bot-fallback absolute inset-0 flex items-center justify-center text-6xl opacity-0 -z-10" aria-hidden="true">🐱</div>
            <div className="stage-hint absolute -bottom-8 left-0 right-0 text-center text-xs text-indigo-400/70 font-display tracking-widest uppercase" data-i18n="hero.hint">
              gatinho do portfólio
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
        <ChevronDown size={20} />
      </div>
    </section>
  )
}

function About({ t }: { t: typeof TRANSLATIONS.pt }) {
  const { ref, visible } = useIntersectionObserver()
  return (
    <Section id="sobre" alt>
      <div ref={ref} className={`max-w-6xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionHeader tag={t.aboutTag} title={t.aboutTitle} />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative mx-auto md:mr-auto md:ml-0">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden gradient-border c-card">
              <img src={profileImg} alt="Sobre mim" className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="absolute -bottom-4 -right-4 c-card border border-indigo-500/30 rounded-xl px-4 py-2 text-sm font-display text-indigo-400">
              &lt;dev /&gt;
            </div>
          </div>
          <div className="space-y-5 text-gray-400 leading-relaxed text-center md:text-left md:text-lg">
            <p>{t.aboutP1} <span className="text-indigo-300 font-medium">{t.aboutCourse}</span>{t.aboutP1End}</p>
            <p>{t.aboutP2Start} <span className="text-indigo-300 font-medium">{t.aboutP2Tech}</span>{t.aboutP2End}</p>
            <p>{t.aboutP3}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Timeline({ t }: { t: typeof TRANSLATIONS.pt }) {
  const { ref, visible } = useIntersectionObserver()
  return (
    <Section id="trajetoria">
      <div ref={ref} className={`max-w-3xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionHeader tag={t.timelineTag} title={t.timelineTitle} subtitle={t.timelineSub} />
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-indigo-600 via-violet-600 to-transparent" />
          <div className="space-y-8">
            {t.timeline.map((item, i) => {
              const Icon = TIMELINE_ICONS[i]
              return (
                <div key={i} className="flex gap-6 group">
                  <div className="relative shrink-0 w-16 h-16 rounded-full c-card border border-indigo-500/20 flex items-center justify-center group-hover:border-indigo-500/60 transition-all duration-300 glow-blue">
                    <Icon size={18} className="text-indigo-400" />
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-display text-[10px] text-indigo-500 whitespace-nowrap">{TIMELINE_YEARS[i]}</span>
                  </div>
                  <div className="flex-1 c-card gradient-border rounded-xl p-5 transition-colors mt-2">
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}

function Skills({ t }: { t: typeof TRANSLATIONS.pt }) {
  const { ref, visible } = useIntersectionObserver()
  return (
    <Section id="habilidades" alt>
      <div ref={ref} className={`max-w-5xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionHeader tag={t.skillsTag} title={t.skillsTitle} subtitle={t.skillsSub} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SKILLS.map((skill, i) => (
            <div
              key={skill.name}
              className="skill-card gradient-border c-card rounded-xl p-5 text-center cursor-default transition-all duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="text-2xl mb-3 font-display font-bold" style={{ color: skill.color }}>{skill.icon}</div>
              <p className="text-white text-sm font-medium mb-3">{skill.name}</p>
              <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: visible ? `${skill.level}%` : '0%',
                    background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <p className="font-display text-xs text-gray-600 mt-1">{skill.level}%</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Projects({ t }: { t: typeof TRANSLATIONS.pt }) {
  const { ref, visible } = useIntersectionObserver()
  return (
    <Section id="projetos">
      <div ref={ref} className={`max-w-6xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SectionHeader tag={t.projectsTag} title={t.projectsTitle} subtitle={t.projectsSub} />
        <div className="grid md:grid-cols-2 gap-6">
          {t.projects.map((p, i) => (
            <div key={i} className="project-card gradient-border c-card rounded-2xl overflow-hidden group cursor-default transition-all duration-300">
              <div className="aspect-video overflow-hidden c-card2">
                <img src={PROJECT_IMAGES[i]} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-white font-semibold text-lg">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TECHS[i].map(tech => (
                    <span key={tech} className="font-display text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">{tech}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <a href="https://github.com/layannesousa2025/Projeto-PI" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors" aria-label={`GitHub – ${p.title}`}>
                    <GithubIcon size={15} /> GitHub
                  </a>
                  {PROJECT_LIVE[i] && PROJECT_DEMO_LINKS[i] && (
                    <a href={PROJECT_DEMO_LINKS[i]} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors" aria-label={`Demo – ${p.title}`}>
                      <ExternalLink size={15} /> Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Contact({ t }: { t: typeof TRANSLATIONS.pt }) {
  const { ref, visible } = useIntersectionObserver()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('layannesousa792@gmail.com')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = 'mailto:layannesousa792@gmail.com'
    }
  }

  return (
    <Section id="contato">
      <div ref={ref} className={`max-w-6xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-18 items-center">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl lg:text-[7rem] leading-[0.88] font-black text-white tracking-[-0.06em]">
              {t.contactHeading}
            </h2>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-gray-300">
              {t.contactIntro}
            </p>
          </div>

          <div className="rounded-[28px] border border-indigo-500/70 bg-[#120d1b]/90 p-5 shadow-[0_0_0_1px_rgba(99,102,241,0.2),0_10px_40px_rgba(139,92,246,0.22)]">
            <div className="flex items-center gap-2 mb-5 pl-1">
              <span className="w-3 h-3 rounded-full bg-[#ff5f7a]" />
              <span className="w-3 h-3 rounded-full bg-[#ffc857]" />
              <span className="w-3 h-3 rounded-full bg-[#56f0a1]" />
            </div>

            <div className="space-y-4 font-mono text-[15px] md:text-[17px] text-white">
              <div className="flex items-center gap-2 text-indigo-400">
                <span>&gt;</span>
                <span>{t.contactTerminalLines[0]}</span>
                <span className="text-green-400">ok</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-400">
                <span>&gt;</span>
                <span>{t.contactTerminalLines[1]}</span>
                <span className="text-green-400">ok</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-400">
                <span>&gt;</span>
                <span>{t.contactTerminalLines[2]}</span>
                <span className="inline-block w-2.5 h-5 bg-indigo-500 animate-pulse" />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-indigo-500/60 bg-[#1c1530] px-4 py-3">
              <span className="font-mono text-lg md:text-xl text-white">layannesousa792@gmail.com</span>
              <button
                type="button"
                onClick={handleCopy}
                className="ml-auto rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(99,102,241,0.45)] transition hover:bg-indigo-400"
              >
                {copied ? t.copiedEmail : t.copyEmail}
              </button>
            </div>

            <div className="mt-7 flex items-center gap-6 text-indigo-400 font-mono text-lg md:text-xl">
              <a href="https://www.linkedin.com/in/layanne-sousa-ab64bb336" target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com/layannesousa2025" target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Footer({ t }: { t: typeof TRANSLATIONS.pt }) {
  return (
    <footer className="border-t border-indigo-500/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-xs text-gray-600">{t.footer}</span>
        <div className="flex gap-4">
          {[
            { icon: GithubIcon, href: '#', label: 'GitHub' },
            { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
            { icon: Mail, href: '#', label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} aria-label={label} className="text-gray-600 hover:text-indigo-400 transition-colors">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { light, toggle } = useTheme()
  const [lang, setLang] = useState<Lang>('pt')
  const t = TRANSLATIONS[lang]

  // Atualiza o lang do HTML e bloqueia auto-tradução do browser
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.setAttribute('translate', 'no')
  }, [lang])

  return (
    <>
      <meta name="description" content="Portfólio de Layanne Sousa – Desenvolvedora de Software em formação, especializada em React, php, javascript, html, css, tailwind, mysql, git, github, vscode IA e desenvolvimento web." />
      <Navbar light={light} toggleTheme={toggle} lang={lang} setLang={setLang} t={t} />
      <main>
        <Hero t={t} />
        <About t={t} />
        <Timeline t={t} />
        <Skills t={t} />
        <Projects t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  )
}
