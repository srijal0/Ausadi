import { ArrowRight, Pill, ClipboardList, TrendingUp, ShieldCheck, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../App.css"

const LandingPage = () => {
  const navigate = useNavigate()

  const handleScroll = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLoginClick = () => {
    navigate("/login")
  }

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="logo-container">
            <Pill className="logo-icon" />
            <h1 className="logo">Ausadi</h1>
          </div>
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#features" onClick={(e) => handleScroll(e, "features")}>
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a href="#benefits" onClick={(e) => handleScroll(e, "benefits")}>
                  Benefits
                </a>
              </li>
              <li className="nav-item">
                <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <button onClick={handleLoginClick} className="btn btn-outline">
                  Login
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="inner-container">
            <div className="hero-content">
              <h2 className="hero-title">Streamline Your Pharmacy Inventory Management</h2>
              <p className="hero-description">
                Ausadi is a comprehensive inventory management system designed specifically for pharmacies. Track
                medications, manage stock levels, and optimize your pharmacy operations with ease.
              </p>
              <div className="hero-buttons">
                <button onClick={handleLoginClick} className="btn btn-primary">
                  Get Started <ArrowRight size={16} />
                </button>
                <button className="btn btn-secondary">Request Demo</button>
              </div>
            </div>
        
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="inner-container">
            <h2 className="section-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <ClipboardList />
                </div>
                <h3 className="feature-title">Inventory Tracking</h3>
                <p className="feature-description">
                  Real-time tracking of all medications and supplies with detailed information on stock levels.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <TrendingUp />
                </div>
                <h3 className="feature-title">Analytics & Reports</h3>
                <p className="feature-description">
                  Comprehensive analytics and reporting tools to monitor sales, inventory turnover, and more.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <ShieldCheck />
                </div>
                <h3 className="feature-title">Expiry Management</h3>
                <p className="feature-description">
                  Automated alerts for approaching expiry dates to minimize waste and ensure patient safety.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Clock />
                </div>
                <h3 className="feature-title">Automated Reordering</h3>
                <p className="feature-description">
                  Set reorder points and get automatic notifications when stock levels are low.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="benefits">
        <div className="container">
          <div className="inner-container">
            <div className="benefits-content">
              <h2 className="section-title">Why Choose Ausadi?</h2>
              <ul className="benefits-list">
                <li className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>Reduce inventory costs by up to 25%</span>
                </li>
                <li className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>Minimize medication waste due to expiry</span>
                </li>
                <li className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>Improve staff efficiency and productivity</span>
                </li>
                <li className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>Ensure compliance with regulatory requirements</span>
                </li>
                <li className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>Enhance customer service with faster dispensing</span>
                </li>
              </ul>
            </div>
            <div className="benefits-image">
              <img src="/placeholder.svg?height=350&width=450" alt="Pharmacy staff using Ausadi" />
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="inner-container">
            <h2 className="cta-title">Ready to Transform Your Pharmacy Operations?</h2>
            <p className="cta-description">
              Join hundreds of pharmacies that have optimized their inventory management with Ausadi.
            </p>
            <button onClick={handleLoginClick} className="btn btn-primary btn-large">
              Start Your Free Trial
            </button>
            <p className="cta-note">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      <footer id="contact" className="footer">
        <div className="container">
          <div className="inner-container">
            <div className="footer-content">
              <div className="footer-logo">
                <Pill className="logo-icon" />
                <h3 className="logo">Ausadi</h3>
                <p className="footer-tagline">Smart Pharmacy Inventory Management</p>
              </div>
              <div className="footer-links">
                <div className="footer-column">
                  <h4 className="footer-heading">Product</h4>
                  <ul className="footer-list">
                    <li>
                      <a href="#features">Features</a>
                    </li>
                    <li>
                      <a href="#pricing">Pricing</a>
                    </li>
                    <li>
                      <a href="#testimonials">Testimonials</a>
                    </li>
                    <li>
                      <a href="#faq">FAQ</a>
                    </li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h4 className="footer-heading">Company</h4>
                  <ul className="footer-list">
                    <li>
                      <a href="#about">About Us</a>
                    </li>
                    <li>
                      <a href="#careers">Careers</a>
                    </li>
                    <li>
                      <a href="#blog">Blog</a>
                    </li>
                    <li>
                      <a href="#contact">Contact</a>
                    </li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h4 className="footer-heading">Contact Us</h4>
                  <ul className="footer-list">
                    <li>Email: info@ausadi.com</li>
                    <li>Phone: +1 (555) 123-4567</li>
                    <li>Address: 123 Pharmacy St, Medical District</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="copyright">© {new Date().getFullYear()} Ausadi. All rights reserved.</p>
              <div className="footer-legal">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

