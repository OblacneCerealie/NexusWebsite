import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Sparkles, Stars } from '@react-three/drei'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

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
function PortfolioItem({ title, category, tags, large, delay }) {
  return (
    <motion.div
      className={`portfolio-item ${large ? 'large' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="portfolio-overlay">
        <h4>{title}</h4>
        <p>{category}</p>
        <div className="portfolio-tags">
          {tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
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

// Success Modal Component
function SuccessModal({ isOpen, onClose }) {
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
            <h3>Thanks for reaching out!</h3>
            <p>We'll shortly get in touch with you via email.</p>
            <motion.button
              className="modal-close-button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Main App Component
function App() {
  const [scrolled, setScrolled] = useState(false)
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
      // Just enter your email (placeholder@gmail.com) and get instant API key
      // No account creation needed, works immediately!
      
      const web3formsAccessKey = 'YOUR_WEB3FORMS_ACCESS_KEY' // Get from https://web3forms.com/
      
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

  const services = [
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

  const portfolio = [
    { title: 'Nova Finance', category: 'Fintech Platform', tags: ['React', 'Node.js', 'AWS'], large: true },
    { title: 'Artisan Market', category: 'E-Commerce', tags: ['Next.js', 'Stripe'] },
    { title: 'FitTrack Pro', category: 'Health App', tags: ['React Native', 'Firebase'] },
    { title: 'CloudSync', category: 'SaaS Dashboard', tags: ['Vue.js', 'GraphQL'] },
    { title: 'EcoLogistics', category: 'Supply Chain', tags: ['Angular', 'Python'], large: true }
  ]

  const techStack = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Python', 'TypeScript',
    'GraphQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Figma'
  ]

  return (
    <>
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
          <li><a href="#services">Services</a></li>
          <li><a href="#portfolio">Work</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#contact">Contact</a></li>
        </motion.ul>
        <motion.button
          className="cta-button"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Project
        </motion.button>
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
            Available for new projects
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We Build{' '}
            <span className="gradient-text">Digital Experiences</span>{' '}
            That Matter
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Award-winning web studio crafting beautiful, high-performance websites 
            and applications that help businesses thrive in the digital age.
          </motion.p>
          
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Work
            </motion.button>
            <motion.button
              className="secondary-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
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
            <Counter end={150} suffix="+" />
          </div>
          <div className="stat-label">Projects Completed</div>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="stat-number gradient-text">
            <Counter end={50} suffix="+" />
          </div>
          <div className="stat-label">Happy Clients</div>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="stat-number gradient-text">
            <Counter end={8} />
          </div>
          <div className="stat-label">Years Experience</div>
        </motion.div>
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="stat-number gradient-text">
            <Counter end={15} />
          </div>
          <div className="stat-label">Team Members</div>
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
            Our Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Everything You Need to{' '}
            <span className="gradient-text">Succeed Online</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            From concept to launch, we handle every aspect of your digital presence
            with precision and creativity.
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
            Our Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Projects That{' '}
            <span className="gradient-text">Speak For Themselves</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            A showcase of our finest work across various industries and technologies.
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
            Technologies
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Powered by{' '}
            <span className="gradient-text">Modern Tech</span>
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
            Our Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            From Idea to{' '}
            <span className="gradient-text">Launch</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our proven process ensures your project is delivered on time and exceeds expectations.
          </motion.p>
        </div>
        <div className="process-grid">
          <ProcessStep number="01" title="Discovery" description="We dive deep into your goals, audience, and competition." delay={0} />
          <ProcessStep number="02" title="Design" description="Crafting beautiful interfaces that tell your story." delay={0.1} />
          <ProcessStep number="03" title="Develop" description="Building with clean code and modern technologies." delay={0.2} />
          <ProcessStep number="04" title="Deploy" description="Launch with confidence and ongoing support." delay={0.3} />
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
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our{' '}
            <span className="gradient-text">Clients Say</span>
          </motion.h2>
        </div>
        <motion.div
          className="testimonial-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <blockquote>
            "Nexus transformed our outdated website into a stunning digital experience. 
            Our conversions increased by 200% within the first month. Absolutely incredible team!"
          </blockquote>
          <div className="testimonial-author">
            <div className="author-avatar"></div>
            <div className="author-info">
              <h5>Sarah Mitchell</h5>
              <p>CEO, TechVentures Inc.</p>
            </div>
          </div>
        </motion.div>
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
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Let's Build Something{' '}
            <span className="gradient-text">Amazing</span>
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
            <h3>Ready to start your project?</h3>
            <p>
              Get in touch with us and let's discuss how we can help bring your vision to life.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <span>📍</span>
                <span>123 Innovation Street, Tech City</span>
              </div>
              <div className="contact-item">
                <span>📧</span>
                <span>hello@nexusstudio.com</span>
              </div>
              <div className="contact-item">
                <span>📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          <form className="contact-form glass-card" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea 
                name="message"
                placeholder="Tell us about your project..." 
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
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo gradient-text">NEXUS</div>
            <p>
              Award-winning web studio crafting digital experiences that help businesses 
              thrive in the modern world.
            </p>
          </div>
          <div className="footer-links">
            <h5>Services</h5>
            <ul>
              <li><a href="#">Web Development</a></li>
              <li><a href="#">UI/UX Design</a></li>
              <li><a href="#">Mobile Apps</a></li>
              <li><a href="#">E-Commerce</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Resources</h5>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Nexus Web Studio. All rights reserved.</p>
          <div className="social-links">
            <a href="#">𝕏</a>
            <a href="#">in</a>
            <a href="#">◎</a>
            <a href="#">▶</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
