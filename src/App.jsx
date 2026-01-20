import { useState, useEffect, useRef, Suspense, createContext, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Sparkles, Stars } from '@react-three/drei'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// Language Context
const LanguageContext = createContext()

// Translations
const translations = {
  sk: {
    // Navigation
    nav: {
      services: 'Služby',
      work: 'Portfólio',
      process: 'Proces',
      contact: 'Kontakt',
      startProject: 'Začať Projekt'
    },
    // Hero
    hero: {
      badge: 'Dostupní pre nové projekty',
      title1: 'Tvoríme',
      title2: 'Digitálne Zážitky',
      title3: 'Ktoré Majú Zmysel',
      description: 'Oceňované webové štúdio vytvárajúce krásne, vysoko výkonné webové stránky a aplikácie, ktoré pomáhajú firmám prosperovať v digitálnom veku.',
      viewWork: 'Pozrieť Práce',
      getInTouch: 'Kontaktujte Nás'
    },
    // Stats
    stats: {
      projects: 'Dokončených Projektov',
      clients: 'Spokojných Klientov',
      experience: 'Roky Skúseností',
      team: 'Členovia Tímu'
    },
    // Services
    services: {
      tag: 'Naše Služby',
      title1: 'Všetko Čo Potrebujete na',
      title2: 'Úspech Online',
      description: 'Od konceptu po spustenie, riešime každý aspekt vašej digitálnej prítomnosti s precíznosťou a kreativitou.',
      items: [
        {
          icon: '🚀',
          title: 'Vývoj Webov',
          description: 'Vlastné webové stránky vytvorené s najmodernejšími technológiami, ktoré rastú s vašim podnikaním.',
          features: ['React & Next.js', 'Optimalizovaný Výkon', 'SEO Pripravené', 'Mobile First']
        },
        {
          icon: '🎨',
          title: 'UI/UX Dizajn',
          description: 'Krásne, intuitívne rozhrania, ktoré potešia používateľov a zvýšia konverzie.',
          features: ['Výskum Používateľov', 'Wireframing', 'Prototypovanie', 'Dizajn Systémy']
        },
        {
          icon: '⚡',
          title: 'Webové Aplikácie',
          description: 'Výkonné webové aplikácie s real-time funkciami a bezproblémovým používateľským zážitkom.',
          features: ['Real-time Dáta', 'Cloud Integrácia', 'API Vývoj', 'Autentifikácia']
        },
        {
          icon: '📱',
          title: 'Mobilné Aplikácie',
          description: 'Multiplatformové mobilné aplikácie, ktoré vyzerajú natívne na každom zariadení.',
          features: ['React Native', 'iOS & Android', 'Push Notifikácie', 'Offline Podpora']
        },
        {
          icon: '🛒',
          title: 'E-Commerce',
          description: 'Online obchody, ktoré konvertujú návštevníkov na zákazníkov s plynulým procesom nákupu.',
          features: ['Platobná Integrácia', 'Správa Skladu', 'Analytika', 'Multi-mena']
        },
        {
          icon: '🔧',
          title: 'Údržba',
          description: 'Udržujte vaše digitálne produkty v bezproblémovom chode s našou nepretržitou podporou.',
          features: ['24/7 Monitoring', 'Pravidelné Aktualizácie', 'Bezpečnostné Záplaty', 'Zálohy']
        }
      ]
    },
    // Portfolio
    portfolio: {
      tag: 'Naša Práca',
      title1: 'Projekty Ktoré',
      title2: 'Hovoria Samy Za Seba',
      description: 'Ukážka našej najlepšej práce naprieč rôznymi odvetviami a technológiami.',
      items: [
        { title: 'Nexus Finance', category: 'Fintech Platforma', tags: ['React', 'Node.js', 'AWS'], link: 'https://nexussk.github.io/NexusFinance/', preview: 'https://nexussk.github.io/NexusFinance/' },
        { title: 'Nexus Medical', category: 'Zdravotníctvo', tags: ['React', 'Node.js'], link: 'https://nexussk.github.io/nexus-medical/', preview: 'https://nexussk.github.io/nexus-medical/' },
        { title: 'FitTrack Pro', category: 'Zdravotná Appka', tags: ['React Native', 'Firebase'] },
        { title: 'CloudSync', category: 'SaaS Dashboard', tags: ['Vue.js', 'GraphQL'] },
        { title: 'EcoLogistics', category: 'Dodávateľský Reťazec', tags: ['Angular', 'Python'] }
      ]
    },
    // Tech
    tech: {
      tag: 'Technológie',
      title1: 'Poháňané',
      title2: 'Modernou Technikou'
    },
    // Process
    process: {
      tag: 'Náš Proces',
      title1: 'Od Nápadu po',
      title2: 'Spustenie',
      description: 'Náš overený proces zabezpečuje, že váš projekt bude dodaný včas a prekoná očakávania.',
      steps: [
        { number: '01', title: 'Objavovanie', description: 'Ponoríme sa hlboko do vašich cieľov, publika a konkurencie.' },
        { number: '02', title: 'Dizajn', description: 'Vytvárame krásne rozhrania, ktoré rozprávajú váš príbeh.' },
        { number: '03', title: 'Vývoj', description: 'Budujeme s čistým kódom a modernými technológiami.' },
        { number: '04', title: 'Nasadenie', description: 'Spustenie s istotou a nepretržitou podporou.' }
      ]
    },
    // Testimonials
    testimonials: {
      tag: 'Referencie',
      title1: 'Čo Hovoria',
      title2: 'Naši Klienti',
      reviews: [
        {
          quote: '"Vynikajúci tím mi pomohol zrealizovať moje sny, efektívny, nápomocný a veľmi dobré ceny. Odporúčam, oveľa lepšie než veľké korporáty ktoré na vás nebudú mať čas."',
          author: 'Oliver Kocian',
          role: 'Spokojný Klient'
        },
        {
          quote: '"Placeholder recenzia - Michal Bača. Tu bude text recenzie."',
          author: 'Michal Bača',
          role: 'Spokojný Klient'
        },
        {
          quote: '"Placeholder recenzia - Jakub Krajňak. Tu bude text recenzie."',
          author: 'Jakub Krajňak',
          role: 'Spokojný Klient'
        },
        {
          quote: '"Placeholder recenzia - Patrícia Mikulová. Tu bude text recenzie."',
          author: 'Patrícia Mikulová',
          role: 'Spokojná Klientka'
        },
        {
          quote: '"Placeholder recenzia - Michal Konečný. Tu bude text recenzie."',
          author: 'Michal Konečný',
          role: 'Spokojný Klient'
        }
      ]
    },
    // Contact Section
    contactSection: {
      tag: 'Kontaktujte Nás',
      title1: 'Poďme Vytvoriť Niečo',
      title2: 'Úžasné',
      readyTitle: 'Pripravení začať váš projekt?',
      readyDescription: 'Kontaktujte nás a porozprávajme sa o tom, ako vám môžeme pomôcť oživiť vašu víziu.',
      address: 'Bratislava, Slovensko',
      email: 'nexusskweb@gmail.com',
      phone: '+421 944 110 266'
    },
    // Contact Page Modal
    contactPage: {
      tag: 'Kontaktujte Nás',
      title1: 'Začnime Váš',
      title2: 'Projekt',
      description: 'Pripravení oživiť vašu víziu? Vyplňte formulár nižšie a ozveme sa vám do 24 hodín.',
      formTitle: 'Pošlite nám správu',
      nameLabel: 'Vaše Meno',
      namePlaceholder: 'Ján Novák',
      emailLabel: 'E-mailová Adresa',
      emailPlaceholder: 'jan@priklad.sk',
      messageLabel: 'Vaša Správa',
      messagePlaceholder: 'Povedzte nám o vašom projekte...',
      sendButton: 'Odoslať Správu',
      sending: 'Odosielam...',
      contactInfo: 'Kontaktné Informácie',
      addressLabel: 'Adresa',
      emailLabelShort: 'Email',
      phoneLabel: 'Telefón',
      followUs: 'Sledujte Nás',
      followDescription: 'Zostaňte v spojení a sledujte našu najnovšiu prácu',
      quickResponse: 'Rýchla Odpoveď',
      quickResponseDesc: 'Zvyčajne odpovedáme do 24 hodín'
    },
    // Footer
    footer: {
      description: 'Oceňované webové štúdio vytvárajúce digitálne zážitky, ktoré pomáhajú firmám prosperovať v modernom svete.',
      services: 'Služby',
      webDev: 'Vývoj Webov',
      uiux: 'UI/UX Dizajn',
      mobileApps: 'Mobilné Aplikácie',
      ecommerce: 'E-Commerce',
      company: 'Spoločnosť',
      aboutUs: 'O Nás',
      ourTeam: 'Náš Tím',
      careers: 'Kariéra',
      contact: 'Kontakt',
      resources: 'Zdroje',
      blog: 'Blog',
      caseStudies: 'Prípadové Štúdie',
      documentation: 'Dokumentácia',
      support: 'Podpora',
      copyright: '© 2026 Nexus Web Studio. Všetky práva vyhradené.'
    },
    // Success Modal
    successModal: {
      title: 'Ďakujeme za správu!',
      description: 'Čoskoro vás budeme kontaktovať e-mailom.',
      close: 'Zavrieť'
    }
  },
  en: {
    // Navigation
    nav: {
      services: 'Services',
      work: 'Work',
      process: 'Process',
      contact: 'Contact',
      startProject: 'Start Project'
    },
    // Hero
    hero: {
      badge: 'Available for new projects',
      title1: 'We Build',
      title2: 'Digital Experiences',
      title3: 'That Matter',
      description: 'Award-winning web studio crafting beautiful, high-performance websites and applications that help businesses thrive in the digital age.',
      viewWork: 'View Our Work',
      getInTouch: 'Get In Touch'
    },
    // Stats
    stats: {
      projects: 'Projects Completed',
      clients: 'Happy Clients',
      experience: 'Years Experience',
      team: 'Team Members'
    },
    // Services
    services: {
      tag: 'Our Services',
      title1: 'Everything You Need to',
      title2: 'Succeed Online',
      description: 'From concept to launch, we handle every aspect of your digital presence with precision and creativity.',
      items: [
        {
          icon: '🚀',
          title: 'Web Development',
          description: 'Custom websites built with cutting-edge technologies that scale with your business.',
          features: ['React & Next.js', 'Performance Optimized', 'SEO Ready', 'Mobile First']
        },
        {
          icon: '🎨',
          title: 'UI/UX Design',
          description: 'Beautiful, intuitive interfaces that delight users and drive conversions.',
          features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
        },
        {
          icon: '⚡',
          title: 'Web Applications',
          description: 'Powerful web apps with real-time features and seamless user experiences.',
          features: ['Real-time Data', 'Cloud Integration', 'API Development', 'Authentication']
        },
        {
          icon: '📱',
          title: 'Mobile Apps',
          description: 'Cross-platform mobile applications that feel native on every device.',
          features: ['React Native', 'iOS & Android', 'Push Notifications', 'Offline Support']
        },
        {
          icon: '🛒',
          title: 'E-Commerce',
          description: 'Online stores that convert visitors into customers with smooth checkout flows.',
          features: ['Payment Integration', 'Inventory Management', 'Analytics', 'Multi-currency']
        },
        {
          icon: '🔧',
          title: 'Maintenance',
          description: 'Keep your digital products running smoothly with our ongoing support.',
          features: ['24/7 Monitoring', 'Regular Updates', 'Security Patches', 'Backups']
        }
      ]
    },
    // Portfolio
    portfolio: {
      tag: 'Our Work',
      title1: 'Projects That',
      title2: 'Speak For Themselves',
      description: 'A showcase of our finest work across various industries and technologies.',
      items: [
        { title: 'Nexus Finance', category: 'Fintech Platform', tags: ['React', 'Node.js', 'AWS'], link: 'https://nexussk.github.io/NexusFinance/', preview: 'https://nexussk.github.io/NexusFinance/' },
        { title: 'Nexus Medical', category: 'Healthcare', tags: ['React', 'Node.js'], link: 'https://nexussk.github.io/nexus-medical/', preview: 'https://nexussk.github.io/nexus-medical/' },
        { title: 'FitTrack Pro', category: 'Health App', tags: ['React Native', 'Firebase'] },
        { title: 'CloudSync', category: 'SaaS Dashboard', tags: ['Vue.js', 'GraphQL'] },
        { title: 'EcoLogistics', category: 'Supply Chain', tags: ['Angular', 'Python'] }
      ]
    },
    // Tech
    tech: {
      tag: 'Technologies',
      title1: 'Powered by',
      title2: 'Modern Tech'
    },
    // Process
    process: {
      tag: 'Our Process',
      title1: 'From Idea to',
      title2: 'Launch',
      description: 'Our proven process ensures your project is delivered on time and exceeds expectations.',
      steps: [
        { number: '01', title: 'Discovery', description: 'We dive deep into your goals, audience, and competition.' },
        { number: '02', title: 'Design', description: 'Crafting beautiful interfaces that tell your story.' },
        { number: '03', title: 'Develop', description: 'Building with clean code and modern technologies.' },
        { number: '04', title: 'Deploy', description: 'Launch with confidence and ongoing support.' }
      ]
    },
    // Testimonials
    testimonials: {
      tag: 'Testimonials',
      title1: 'What Our',
      title2: 'Clients Say',
      reviews: [
        {
          quote: '"An excellent team helped me realize my dreams, efficient, helpful and very good prices. I highly recommend them, much better than large corporations that won\'t have time for you."',
          author: 'Oliver Kocian',
          role: 'Satisfied Client'
        },
        {
          quote: '"Placeholder review - Michal Bača. Review text will go here."',
          author: 'Michal Bača',
          role: 'Satisfied Client'
        },
        {
          quote: '"Placeholder review - Jakub Krajňak. Review text will go here."',
          author: 'Jakub Krajňak',
          role: 'Satisfied Client'
        },
        {
          quote: '"Placeholder review - Patrícia Mikulová. Review text will go here."',
          author: 'Patrícia Mikulová',
          role: 'Satisfied Client'
        },
        {
          quote: '"Placeholder review - Michal Konečný. Review text will go here."',
          author: 'Michal Konečný',
          role: 'Satisfied Client'
        }
      ]
    },
    // Contact Section
    contactSection: {
      tag: 'Get In Touch',
      title1: "Let's Build Something",
      title2: 'Amazing',
      readyTitle: 'Ready to start your project?',
      readyDescription: "Get in touch with us and let's discuss how we can help bring your vision to life.",
      address: 'Bratislava, Slovakia',
      email: 'nexusskweb@gmail.com',
      phone: '+421 944 110 266'
    },
    // Contact Page Modal
    contactPage: {
      tag: 'Get In Touch',
      title1: "Let's Start Your",
      title2: 'Project',
      description: "Ready to bring your vision to life? Fill out the form below and we'll get back to you within 24 hours.",
      formTitle: 'Send us a message',
      nameLabel: 'Your Name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Email Address',
      emailPlaceholder: 'john@example.com',
      messageLabel: 'Your Message',
      messagePlaceholder: 'Tell us about your project...',
      sendButton: 'Send Message',
      sending: 'Sending...',
      contactInfo: 'Contact Information',
      addressLabel: 'Address',
      emailLabelShort: 'Email',
      phoneLabel: 'Phone',
      followUs: 'Follow Us',
      followDescription: 'Stay connected and see our latest work',
      quickResponse: 'Quick Response',
      quickResponseDesc: 'We typically respond within 24 hours'
    },
    // Footer
    footer: {
      description: 'Award-winning web studio crafting digital experiences that help businesses thrive in the modern world.',
      services: 'Services',
      webDev: 'Web Development',
      uiux: 'UI/UX Design',
      mobileApps: 'Mobile Apps',
      ecommerce: 'E-Commerce',
      company: 'Company',
      aboutUs: 'About Us',
      ourTeam: 'Our Team',
      careers: 'Careers',
      contact: 'Contact',
      resources: 'Resources',
      blog: 'Blog',
      caseStudies: 'Case Studies',
      documentation: 'Documentation',
      support: 'Support',
      copyright: '© 2026 Nexus Web Studio. All rights reserved.'
    },
    // Success Modal
    successModal: {
      title: 'Thanks for reaching out!',
      description: "We'll shortly get in touch with you via email.",
      close: 'Close'
    }
  }
}

// Custom hook for translations
function useTranslation() {
  const { language } = useContext(LanguageContext)
  return translations[language]
}

// 3D Animated Sphere Component
function AnimatedSphere({ position, color, speed = 1, distort = 0.4 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

// 3D Torus Knot
function AnimatedTorus({ position, color }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

// 3D Octahedron
function AnimatedOctahedron({ position, color }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.5
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={3} rotationIntensity={1.5} floatIntensity={2.5}>
      <mesh ref={meshRef} position={position} scale={0.7}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}

// Particle Field
function ParticleField() {
  const particlesRef = useRef()
  const count = 500
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 25
    positions[i + 1] = (Math.random() - 0.5) * 25
    positions[i + 2] = (Math.random() - 0.5) * 25
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d4ff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}

// 3D Scene
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#b24bf3" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#00d4ff" />
      
      <AnimatedSphere position={[-3, 2, -2]} color="#00d4ff" speed={0.8} distort={0.5} />
      <AnimatedSphere position={[4, -1, -3]} color="#b24bf3" speed={1.2} distort={0.3} />
      <AnimatedTorus position={[3, 2, -4]} color="#ff2d92" />
      <AnimatedOctahedron position={[-4, -2, -3]} color="#00d4ff" />
      <AnimatedOctahedron position={[0, 3, -5]} color="#b24bf3" />
      
      <ParticleField />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={15} size={2} speed={0.4} color="#00d4ff" />
    </>
  )
}

// Animated Counter
function Counter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// Service Card Component
function ServiceCard({ icon, title, description, features, delay }) {
  return (
    <motion.div
      className="service-card glass-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="service-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="service-features">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </motion.div>
  )
}

// Portfolio Item Component
function PortfolioItem({ title, category, large, delay, link, preview }) {
  const content = (
    <motion.div
      className={`portfolio-item-wrapper`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <motion.div
        className={`portfolio-item ${large ? 'large' : ''} ${preview ? 'has-preview' : ''}`}
        whileHover={{ scale: 1.03 }}
      >
        {preview && (
          <div className="portfolio-preview">
            <iframe
              src={preview}
              title={title}
              loading="lazy"
              scrolling="no"
            />
          </div>
        )}
        {link && (
          <div className="portfolio-hover-overlay">
            <span className="portfolio-link-hint">↗</span>
          </div>
        )}
      </motion.div>
      <div className="portfolio-info">
        <h4>{title}</h4>
        <p>{category}</p>
      </div>
    </motion.div>
  )
  
  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {content}
      </a>
    )
  }
  
  return content
}

// Process Step Component
function ProcessStep({ number, title, description, delay }) {
  return (
    <motion.div
      className="process-step"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="step-number">{number}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </motion.div>
  )
}

// Testimonial Carousel Component
function TestimonialCarousel({ reviews }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000) // Change every 5 seconds
    
    return () => clearInterval(interval)
  }, [reviews.length, resetKey]) // resetKey dependency restarts the timer
  
  const handleDotClick = (index) => {
    setCurrentIndex(index)
    setResetKey((prev) => prev + 1) // Reset the timer
  }
  
  return (
    <div className="testimonial-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="testimonial-card glass-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <blockquote>
            {reviews[currentIndex].quote}
          </blockquote>
          <div className="testimonial-author">
            <div className="author-avatar"></div>
            <div className="author-info">
              <h5>{reviews[currentIndex].author}</h5>
              <p>{reviews[currentIndex].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Dots indicator */}
      <div className="testimonial-dots">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`testimonial-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  )
}

// Success Modal Component
function SuccessModal({ isOpen, onClose }) {
  const { language } = useContext(LanguageContext)
  const t = translations[language]
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="success-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="modal-icon">✓</div>
            <h3>{t.successModal.title}</h3>
            <p>{t.successModal.description}</p>
            <motion.button
              className="modal-close-button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.successModal.close}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Full Contact Page Modal
function ContactPageModal({ isOpen, onClose, formData, handleInputChange, handleSubmit, isSubmitting }) {
  const { language } = useContext(LanguageContext)
  const t = translations[language]
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="contact-page-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background with same gradient */}
          <div className="contact-page-bg">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          {/* Close Button */}
          <motion.button
            className="contact-page-close"
            onClick={onClose}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>

          {/* Content */}
          <div className="contact-page-content">
            <motion.div
              className="contact-page-header"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="section-tag">{t.contactPage.tag}</span>
              <h1>{t.contactPage.title1} <span className="gradient-text">{t.contactPage.title2}</span></h1>
              <p>{t.contactPage.description}</p>
            </motion.div>

            <div className="contact-page-grid">
              {/* Contact Form */}
              <motion.form
                className="contact-page-form glass-card"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
              >
                <h3>{t.contactPage.formTitle}</h3>
                <div className="form-group">
                  <label>{t.contactPage.nameLabel}</label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t.contactPage.namePlaceholder}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t.contactPage.emailLabel}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.contactPage.emailPlaceholder}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t.contactPage.messageLabel}</label>
                  <textarea
                    name="message"
                    placeholder={t.contactPage.messagePlaceholder}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="cta-button"
                  style={{ width: '100%' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.contactPage.sending : t.contactPage.sendButton}
                </motion.button>
              </motion.form>

              {/* Contact Info & Social */}
              <motion.div
                className="contact-page-info"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Contact Details Card */}
                <div className="contact-info-card glass-card">
                  <h3>{t.contactPage.contactInfo}</h3>
                  <div className="contact-details-list">
                    <div className="contact-detail-item">
                      <div className="contact-icon">📍</div>
                      <div>
                        <h4>{t.contactPage.addressLabel}</h4>
                        <p>{t.contactSection.address}</p>
                      </div>
                    </div>
                    <div className="contact-detail-item">
                      <div className="contact-icon">📧</div>
                      <div>
                        <h4>{t.contactPage.emailLabelShort}</h4>
                        <p>{t.contactSection.email}</p>
                      </div>
                    </div>
                    <div className="contact-detail-item">
                      <div className="contact-icon">📞</div>
                      <div>
                        <h4>{t.contactPage.phoneLabel}</h4>
                        <p>{t.contactSection.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Card */}
                <div className="social-media-card glass-card">
                  <h3>{t.contactPage.followUs}</h3>
                  <p>{t.contactPage.followDescription}</p>
                  <div className="social-links-grid">
                    <motion.a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="social-icon twitter">𝕏</div>
                      <span>Twitter</span>
                    </motion.a>
                    <motion.a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="social-icon linkedin">in</div>
                      <span>LinkedIn</span>
                    </motion.a>
                    <motion.a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="social-icon instagram">◎</div>
                      <span>Instagram</span>
                    </motion.a>
                    <motion.a
                      href="https://dribbble.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="social-icon dribbble">●</div>
                      <span>Dribbble</span>
                    </motion.a>
                    <motion.a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="social-icon github">⌘</div>
                      <span>GitHub</span>
                    </motion.a>
                    <motion.a
                      href="https://behance.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="social-icon behance">Bē</div>
                      <span>Behance</span>
                    </motion.a>
                  </div>
                </div>

                {/* Quick Response Badge */}
                <motion.div
                  className="response-badge glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="response-icon">⚡</div>
                  <div>
                    <h4>{t.contactPage.quickResponse}</h4>
                    <p>{t.contactPage.quickResponseDesc}</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Language Toggle Component
function LanguageToggle() {
  const { language, setLanguage } = useContext(LanguageContext)
  
  return (
    <motion.button
      className="language-toggle"
      onClick={() => setLanguage(language === 'sk' ? 'en' : 'sk')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <span className={language === 'sk' ? 'active' : ''}>SK</span>
      <span className="divider">/</span>
      <span className={language === 'en' ? 'active' : ''}>EN</span>
    </motion.button>
  )
}

// Main App Component
function App() {
  const [language, setLanguage] = useState('sk')
  const [scrolled, setScrolled] = useState(false)
  const [showContactPage, setShowContactPage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Using Web3Forms - Simple and free email service
      // Get your free API key at: https://web3forms.com/
      // API key is stored in .env file for security
      
      const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
      
      if (!web3formsAccessKey) {
        throw new Error('Web3Forms API key is not configured. Please set VITE_WEB3FORMS_ACCESS_KEY in your .env file.')
      }
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          subject: `New Contact Form Submission from ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          message: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
          to: 'placeholder@gmail.com' // Recipient email address
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message')
      }

      // Close contact modal if open
      setShowContactPage(false)
      
      // Show success modal
      setShowSuccessModal(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      })
    } catch (error) {
      console.error('Error sending email:', error)
      alert(`Sorry, there was an error sending your message: ${error.message}. Please make sure you have set up Web3Forms (get free API key at web3forms.com) or check the console for details.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const techStack = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Python', 'TypeScript',
    'GraphQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Figma'
  ]
  
  // Get translated data
  const services = t.services.items
  const portfolio = t.portfolio.items.map((item, index) => ({
    ...item,
    large: index === 0 || index === 4
  }))

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Gradient Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <motion.div
          className="logo gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          NEXUS
        </motion.div>
        <motion.ul
          className="nav-links"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <li><a href="#services">{t.nav.services}</a></li>
          <li><a href="#portfolio">{t.nav.work}</a></li>
          <li><a href="#process">{t.nav.process}</a></li>
          <li><a href="#contact">{t.nav.contact}</a></li>
        </motion.ul>
        <div className="nav-right">
          <LanguageToggle />
          <motion.button
            className="cta-button"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowContactPage(true)}
          >
            {t.nav.startProject}
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section className="hero" style={{ opacity: heroOpacity, scale: heroScale }}>
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span></span>
            {t.hero.badge}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t.hero.title1}{' '}
            <span className="gradient-text">{t.hero.title2}</span>{' '}
            {t.hero.title3}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {t.hero.description}
          </motion.p>
          
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.a
              href="#portfolio"
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ textDecoration: 'none' }}
            >
              {t.hero.viewWork}
            </motion.a>
            <motion.button
              className="secondary-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContactPage(true)}
            >
              {t.hero.getInTouch}
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="stats">
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="stat-number gradient-text">
            <Counter end={25} suffix="+" />
          </div>
          <div className="stat-label">{t.stats.projects}</div>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="stat-number gradient-text">
            <Counter end={10} suffix="+" />
          </div>
          <div className="stat-label">{t.stats.clients}</div>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="stat-number gradient-text">
            <Counter end={2} />
          </div>
          <div className="stat-label">{t.stats.experience}</div>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="stat-number gradient-text">
            <Counter end={4} />
          </div>
          <div className="stat-label">{t.stats.team}</div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.services.tag}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.services.title1}{' '}
            <span className="gradient-text">{t.services.title2}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t.services.description}
          </motion.p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio">
        <div className="section-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.portfolio.tag}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.portfolio.title1}{' '}
            <span className="gradient-text">{t.portfolio.title2}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t.portfolio.description}
          </motion.p>
        </div>
        <div className="portfolio-grid">
          {portfolio.map((item, index) => (
            <PortfolioItem key={index} {...item} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-stack">
        <div className="section-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.tech.tag}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.tech.title1}{' '}
            <span className="gradient-text">{t.tech.title2}</span>
          </motion.h2>
        </div>
        <div className="tech-carousel">
          {[...techStack, ...techStack].map((tech, index) => (
            <div key={index} className="tech-item">
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="process">
        <div className="section-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.process.tag}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.process.title1}{' '}
            <span className="gradient-text">{t.process.title2}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t.process.description}
          </motion.p>
        </div>
        <div className="process-grid">
          {t.process.steps.map((step, index) => (
            <ProcessStep key={index} number={step.number} title={step.title} description={step.description} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.testimonials.tag}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.testimonials.title1}{' '}
            <span className="gradient-text">{t.testimonials.title2}</span>
          </motion.h2>
        </div>
        <TestimonialCarousel reviews={t.testimonials.reviews} />
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.contactSection.tag}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.contactSection.title1}{' '}
            <span className="gradient-text">{t.contactSection.title2}</span>
          </motion.h2>
        </div>
        <motion.div
          className="contact-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="contact-info">
            <h3>{t.contactSection.readyTitle}</h3>
            <p>
              {t.contactSection.readyDescription}
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <span>📍</span>
                <span>{t.contactSection.address}</span>
              </div>
              <div className="contact-item">
                <span>📧</span>
                <span>{t.contactSection.email}</span>
              </div>
              <div className="contact-item">
                <span>📞</span>
                <span>{t.contactSection.phone}</span>
              </div>
            </div>
          </div>
          <form className="contact-form glass-card" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.contactPage.nameLabel}</label>
              <input 
                type="text" 
                name="name"
                placeholder={t.contactPage.namePlaceholder}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t.contactPage.emailLabel}</label>
              <input 
                type="email" 
                name="email"
                placeholder={t.contactPage.emailPlaceholder}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t.contactPage.messageLabel}</label>
              <textarea 
                name="message"
                placeholder={t.contactPage.messagePlaceholder}
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="cta-button"
              style={{ width: '100%' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? t.contactPage.sending : t.contactPage.sendButton}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />

      {/* Contact Page Modal */}
      <ContactPageModal
        isOpen={showContactPage}
        onClose={() => setShowContactPage(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo gradient-text">NEXUS</div>
            <p>
              {t.footer.description}
            </p>
          </div>
          <div className="footer-links">
            <h5>{t.footer.services}</h5>
            <ul>
              <li><a href="#">{t.footer.webDev}</a></li>
              <li><a href="#">{t.footer.uiux}</a></li>
              <li><a href="#">{t.footer.mobileApps}</a></li>
              <li><a href="#">{t.footer.ecommerce}</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>{t.footer.company}</h5>
            <ul>
              <li><a href="#">{t.footer.aboutUs}</a></li>
              <li><a href="#">{t.footer.ourTeam}</a></li>
              <li><a href="#">{t.footer.careers}</a></li>
              <li><a href="#">{t.footer.contact}</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>{t.footer.resources}</h5>
            <ul>
              <li><a href="#">{t.footer.blog}</a></li>
              <li><a href="#">{t.footer.caseStudies}</a></li>
              <li><a href="#">{t.footer.documentation}</a></li>
              <li><a href="#">{t.footer.support}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.footer.copyright}</p>
          <div className="social-links">
            <a href="#">𝕏</a>
            <a href="#">in</a>
            <a href="#">◎</a>
            <a href="#">▶</a>
          </div>
        </div>
      </footer>
    </LanguageContext.Provider>
  )
}

export default App
