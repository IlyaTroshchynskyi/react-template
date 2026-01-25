import { useState } from 'react'
import './App.css'

// Rule 6.3: Hoist Static JSX Elements
const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const

const FEATURES = [
  {
    id: 'fast',
    icon: '🚀',
    title: 'Lightning Fast',
    description: 'Optimized performance for the best user experience'
  },
  {
    id: 'design',
    icon: '🎨',
    title: 'Beautiful Design',
    description: 'Modern and elegant interfaces that users love'
  },
  {
    id: 'secure',
    icon: '🔒',
    title: 'Secure',
    description: 'Built with security best practices in mind'
  },
] as const

// Rule 6.3: Hoist static visual elements
const FLOATING_CARDS = (
  <>
    <div className="floating-card card-1"></div>
    <div className="floating-card card-2"></div>
    <div className="floating-card card-3"></div>
  </>
)

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Rule 5.7: Put interaction logic in event handlers
  // Rule 5.9: Use functional setState updates
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">ModernApp</span>
          </div>
          
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            {NAV_ITEMS.map(item => (
              <li key={item.id} className="nav-item">
                <a href={item.href} className="nav-link">{item.label}</a>
              </li>
            ))}
          </ul>

          <button 
            className="nav-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to the Future
          </h1>
          <p className="hero-subtitle">
            Build amazing experiences with modern web technologies. 
            Fast, elegant, and powerful.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          {FLOATING_CARDS}
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">Our Features</h2>
        <div className="features-grid">
          {FEATURES.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
