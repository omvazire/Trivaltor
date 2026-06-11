import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LeadPopup } from '../components/LeadPopup';
import { Globe2, Menu, X, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import logoImg from '../assets/images/1006818.png'; // 1006818.png is the logo

export const Layout = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const activeStyle = ({ isActive }) => 
    isActive ? 'nav-link active' : 'nav-link';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLangDropdown = () => {
    setLangDropdownOpen(!langDropdownOpen);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const phoneNumber = '919876543210'; // Client demo support number
    const text = encodeURIComponent(
      'Hello Trivaltor Group, I am interested in exploring business, trade, and investment opportunities. Please share more details.'
    );
    
    // Check user agent for mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    const url = isMobile
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Banner (Optional Premium Touch) */}
      <div className="top-premium-banner" style={{
        backgroundColor: 'var(--accent-gold-light)',
        color: 'var(--accent-gold-hover)',
        fontSize: '0.75rem',
        padding: '0.35rem 1rem',
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: '0.08em',
        borderBottom: '1px solid var(--border-color)',
        textTransform: 'uppercase'
      }}>
        Trivaltor Group of Companies • Global Trade & Strategic Investment Ecosystem
      </div>

      {/* Main Header */}
      <header className="nav-header">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <img src={logoImg} alt="Trivaltor Logo" onError={(e) => {
              e.target.style.display = 'none'; // Fallback if image doesn't load
            }} />
            <span>TRIVALTOR</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" className={activeStyle} end>{t('home')}</NavLink>
            <NavLink to="/farmer" className={activeStyle}>{t('farmersPortal')}</NavLink>
            <NavLink to="/buyer" className={activeStyle}>{t('buyersPortal')}</NavLink>
            <NavLink to="/investor" className={activeStyle}>{t('investorsPortal')}</NavLink>
            <NavLink to="/admin" className={activeStyle}>{t('adminDashboard')}</NavLink>
          </nav>

          {/* Right Action buttons */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Language Selector Dropdown */}
            <div className="language-selector-wrapper">
              <button 
                onClick={toggleLangDropdown} 
                className="language-selector-btn"
                aria-label={t('switchLanguage')}
                title={t('switchLanguage')}
              >
                <Globe2 size={16} />
                <span>{language === 'en' ? 'EN' : 'मराठी'}</span>
              </button>

              {langDropdownOpen && (
                <div className="language-dropdown">
                  <button 
                    onClick={() => selectLanguage('en')} 
                    className={`language-dropdown-item ${language === 'en' ? 'active' : ''}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => selectLanguage('mr')} 
                    className={`language-dropdown-item ${language === 'mr' ? 'active' : ''}`}
                  >
                    मराठी
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={toggleMobileMenu} className="menu-toggle" aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink 
          to="/" 
          className="mobile-drawer-link" 
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('home')}
        </NavLink>
        <NavLink 
          to="/farmer" 
          className="mobile-drawer-link" 
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('farmersPortal')}
        </NavLink>
        <NavLink 
          to="/buyer" 
          className="mobile-drawer-link" 
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('buyersPortal')}
        </NavLink>
        <NavLink 
          to="/investor" 
          className="mobile-drawer-link" 
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('investorsPortal')}
        </NavLink>
        <NavLink 
          to="/admin" 
          className="mobile-drawer-link" 
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('adminDashboard')}
        </NavLink>
      </div>
    </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>

      {/* Floating WhatsApp Button */}
      <a 
        href="#whatsapp" 
        onClick={handleWhatsAppClick} 
        className="whatsapp-float flex-center"
        aria-label="Contact Trivaltor via WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageSquare size={28} fill="currentColor" stroke="none" />
      </a>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-column">
            <Link to="/" className="nav-logo" style={{ marginBottom: '1.25rem' }}>
              <img src={logoImg} alt="Trivaltor Logo" style={{ height: '36px' }} />
              <span style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>TRIVALTOR GROUP</span>
            </Link>
            <p className="footer-desc" style={{ fontSize: '0.875rem' }}>
              A premium diversified conglomerate linking organic farming, international trade, imports, exports, and high-yield strategic agricultural investments into a single unified trust ecosystem.
            </p>
          </div>

          <div className="footer-column">
            <h3>{t('quickLinks') || 'Quick Links'}</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">{t('home')}</Link></li>
              <li><Link to="/farmer" className="footer-link">{t('farmersPortal')}</Link></li>
              <li><Link to="/buyer" className="footer-link">{t('buyersPortal')}</Link></li>
              <li><Link to="/investor" className="footer-link">{t('investorsPortal')}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>{t('businessPortals') || 'Business Portals'}</h3>
            <ul className="footer-links">
              <li><Link to="/admin" className="footer-link">{t('adminDashboard')}</Link></li>
              <li><Link to="/#about" className="footer-link">{t('pillar1Title') || 'Three Pillars'}</Link></li>
              <li><Link to="/#categories" className="footer-link">{t('categoriesTitle') || 'Product Categories'}</Link></li>
              <li><Link to="/#contact" className="footer-link">{t('contactDesk') || 'Contact Desk'}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>{t('headquarters')}</h3>
            <div className="footer-contact-item">
              <MapPin size={18} />
              <span style={{ fontSize: '0.875rem' }}>
                {t('addressText')}
              </span>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} />
              <span style={{ fontSize: '0.875rem' }}>
                <a href="mailto:info@trivaltor.com" style={{ textDecoration: 'underline' }}>
                  info@trivaltor.com
                </a>
              </span>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} />
              <span style={{ fontSize: '0.875rem' }}>
                +91 (484) 285-9000
              </span>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} {t('rightsReserved')}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer' }}>{t('privacyPolicy')}</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>{t('termsOfTrade')}</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>{t('demoMode')}</span>
          </div>
        </div>
      </footer>

      {/* Render Lead Capture Popup */}
      <LeadPopup />
    </div>
  );
};
