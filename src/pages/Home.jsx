import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useLanguage } from '../context/LanguageContext';
import { categoriesData } from '../services/categoriesData';
import { config } from '../services/config';
import { 
  Sprout, Globe2, TrendingUp, Shovel, Ship, Landmark, ArrowRight, 
  Mail, Phone, MapPin, Send, CheckCircle2, Star, Download, FileText
} from 'lucide-react';

// Import local assets
import heroImg from '../assets/images/export-hero.png';
import imgAgri from '../assets/images/deal-agriculture.jpg';
import imgExport from '../assets/images/deal-export.jpeg';
import imgInvest from '../assets/images/deal-invest.jpg';

export const Home = () => {
  const navigate = useNavigate();
  const { submitContactLead, loading } = useLeads();
  const { language, t } = useLanguage();
  const contactSectionRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Contact Form State with Address Fields
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    state: '',
    district: '',
    cityVillage: '',
    pincode: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const res = await submitContactLead(contactForm);
    if (res.success) {
      setSubmitSuccess(true);
      setContactForm({ 
        name: '', 
        email: '', 
        subject: '', 
        message: '',
        state: '',
        district: '',
        cityVillage: '',
        pincode: ''
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="section hero-section" style={{ 
        paddingTop: '5rem',
        paddingBottom: '5rem',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div className="container hero-container" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Hero Left (Text & CTAs) */}
          <div className="animate-fade-in hero-text-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span className="section-tag">{t('welcomeTag')}</span>
            <h1 className="hero-title" style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              lineHeight: '1.15', 
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em'
            }}>
              {t('heroTitle').split(',')[0]}, <br />
              <span style={{ color: 'var(--accent-gold)' }}>{t('heroTitle').split(',')[1]}</span> {language === 'mr' ? 'आणि' : '&'} <br />
              {t('heroTitle').split(',')[2] || (language === 'mr' ? 'धोरणात्मक गुंतवणूकदार' : 'Strategic Investors')}
            </h1>
            <p className="hero-desc-p" style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              maxWidth: '540px'
            }}>
              {t('heroDesc')}
            </p>
            
            {/* Hero CTAs */}
            <div className="hero-ctas-wrapper" style={{ 
              display: 'flex', 
              gap: '1rem', 
              flexWrap: 'wrap', 
              marginTop: '1.5rem' 
            }}>
              <button 
                onClick={() => navigate('/farmer')} 
                className="btn btn-primary"
                style={{ flex: '1', minWidth: '160px' }}
              >
                {t('iAmFarmer')}
              </button>
              <button 
                onClick={() => navigate('/buyer')} 
                className="btn btn-secondary"
                style={{ flex: '1', minWidth: '160px' }}
              >
                {t('iAmBuyer')}
              </button>
              <button 
                onClick={() => navigate('/investor')} 
                className="btn btn-dark"
                style={{ flex: '1', minWidth: '160px' }}
              >
                {t('iAmInvestor')}
              </button>
            </div>
          </div>

          {/* Hero Right (Visual Image Showcase) */}
          {!isMobile && (
            <div className="animate-fade-in hero-visual-wrapper" style={{ 
              position: 'relative', 
              borderRadius: 'var(--border-radius-lg)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              height: '480px'
            }}>
              <img 
                src={heroImg} 
                alt="Trivaltor Corporate presentation" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {/* Overlay Gradient for high premium feel */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(31,27,22,0.85), transparent)',
                padding: '2rem',
                color: '#ffffff'
              }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                  {t('tradeEcosystem')}
                </h4>
                <span style={{ fontSize: '0.85rem', opacity: '0.9', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {t('tradeEcosystemDesc')}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. About Section (Three Pillars) */}
      <section id="about" className="section about-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('corePrinciples')}</span>
            <h2 className="section-title">{t('threePillars')}</h2>
            <p className="section-desc">
              {t('pillarsDesc')}
            </p>
          </div>

          <div className="pillars-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem',
            marginTop: '1.5rem'
          }}>
            {/* Pillar 1 */}
            <div className="premium-card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px', 
                backgroundColor: 'var(--accent-gold-light)', 
                color: 'var(--accent-gold-hover)',
                marginBottom: '1.5rem'
              }} className="flex-center">
                <Sprout size={30} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('pillar1Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {t('pillar1Desc')}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="premium-card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px', 
                backgroundColor: 'var(--accent-gold-light)', 
                color: 'var(--accent-gold-hover)',
                marginBottom: '1.5rem'
              }} className="flex-center">
                <Globe2 size={30} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('pillar2Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {t('pillar2Desc')}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="premium-card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px', 
                backgroundColor: 'var(--accent-gold-light)', 
                color: 'var(--accent-gold-hover)',
                marginBottom: '1.5rem'
              }} className="flex-center">
                <TrendingUp size={30} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('pillar3Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {t('pillar3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Business Overview */}
      <section className="section divisions-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('operationalScope')}</span>
            <h2 className="section-title">{t('diverseActivities')}</h2>
            <p className="section-desc">
              {t('divisionsDesc')}
            </p>
          </div>

          <div className="divisions-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '2rem'
          }}>
            {/* Div 1 */}
            <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img src={imgAgri} alt="Agriculture Division" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
              <div style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                  <Shovel size={18} />
                  <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('division1')}</strong>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('div1Title')}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {t('div1Desc')}
                </p>
              </div>
            </div>

            {/* Div 2 */}
            <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img src={imgExport} alt="Export Division" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                  <Ship size={18} />
                  <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('division2')}</strong>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('div2Title')}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {t('div2Desc')}
                </p>
              </div>
            </div>

            {/* Div 4 */}
            <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img src={imgInvest} alt="Investment Division" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
                  <Landmark size={18} />
                  <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('division4')}</strong>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('div4Title')}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {t('div4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Categories Section (Replaces Mixed Catalog) */}
      <section id="categories" className="section categories-section" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('categoriesTitle')}</span>
            <h2 className="section-title">{t('categoriesTitle')}</h2>
            <p className="section-desc">
              {t('categoriesDesc')}
            </p>
          </div>

          <div className="categories-grid">
            {categoriesData.map((category) => {
              const catName = category.name[language] || category.name['en'];
              const catDesc = category.description[language] || category.description['en'];
              
              return (
                <div key={category.id} className="category-card animate-fade-in">
                  <div className="category-image-container">
                    <img src={category.image} alt={catName} />
                  </div>
                  <div className="category-card-content">
                    <h3 className="category-card-title">{catName}</h3>
                    <p className="category-card-desc">{catDesc}</p>
                    <button 
                      onClick={() => navigate(`/category/${category.id}`)}
                      className="btn btn-primary btn-sm"
                      style={{ alignSelf: 'flex-start', marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {t('exploreProducts')} <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Company Video Section */}
      <section id="video" className="section video-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag">{t('videoTag')}</span>
            <h2 className="section-title">{t('videoTitle')}</h2>
            <p className="section-desc" style={{ marginBottom: '0' }}>
              {t('videoDesc')}
            </p>
          </div>

          <div className="video-wrapper">
            <iframe
              src={config.youtubeEmbedUrl}
              title="Tirvaltor Group Corporate Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* 6. Credibility & Achievements Section */}
      <section id="credibility" className="section credibility-section" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('credibilityTag')}</span>
            <h2 className="section-title">{t('credibilityTitle')}</h2>
            <p className="section-desc">
              {t('credibilityDesc')}
            </p>
          </div>

          <div className="credibility-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            <div className="premium-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {t('overviewTitle')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {t('overviewText')}
              </p>
            </div>
            <div className="premium-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {t('achievementsTitle')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {t('achievementsText')}
              </p>
            </div>
            <div className="premium-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {t('exportCapTitle')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {t('exportCapText')}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="credibility-stats">
            <div className="stat-card">
              <div className="stat-number">{t('stat1Val')}</div>
              <div className="stat-label">{t('stat1Lbl')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{t('stat2Val')}</div>
              <div className="stat-label">{t('stat2Lbl')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{t('stat3Val')}</div>
              <div className="stat-label">{t('stat3Lbl')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{t('stat4Val')}</div>
              <div className="stat-label">{t('stat4Lbl')}</div>
            </div>
          </div>

          {/* Document downloads */}
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginTop: '4rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
            {t('downloadDocs')}
          </h3>
          <div className="download-grid">
            <a href="#prospectus" className="download-card" onClick={(e) => { e.preventDefault(); alert("Simulated Download: Tirvaltor Business Prospectus"); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={24} style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t('downloadProspectus')}</span>
              </div>
              <Download size={18} style={{ color: 'var(--text-muted)' }} />
            </a>
            <a href="#sales" className="download-card" onClick={(e) => { e.preventDefault(); alert("Simulated Download: Annual Sales Report"); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={24} style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t('downloadReport')}</span>
              </div>
              <Download size={18} style={{ color: 'var(--text-muted)' }} />
            </a>
            <a href="#certs" className="download-card" onClick={(e) => { e.preventDefault(); alert("Simulated Download: Export Standard Certificates"); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={24} style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t('downloadCertificates')}</span>
              </div>
              <Download size={18} style={{ color: 'var(--text-muted)' }} />
            </a>
          </div>
        </div>
      </section>

      {/* 7. Reviews Section */}
      <section id="testimonials" className="section reviews-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('reviewsTag')}</span>
            <h2 className="section-title">{t('reviewsTitle')}</h2>
            <p className="section-desc">{t('reviewsDesc')}</p>
          </div>

          <div className="reviews-grid">
            {/* Review 1 */}
            <div className="review-card">
              <div className="stars-container">
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
              </div>
              <p className="review-text">"{t('review1Text')}"</p>
              <div className="review-author">- {t('review1Name')}</div>
            </div>
            {/* Review 2 */}
            <div className="review-card">
              <div className="stars-container">
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
              </div>
              <p className="review-text">"{t('review2Text')}"</p>
              <div className="review-author">- {t('review2Name')}</div>
            </div>
            {/* Review 3 */}
            <div className="review-card">
              <div className="stars-container">
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
              </div>
              <p className="review-text">"{t('review3Text')}"</p>
              <div className="review-author">- {t('review3Name')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact Section */}
      <section id="contact" ref={contactSectionRef} className="section contact-section" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)' 
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('getInTouch')}</span>
            <h2 className="section-title">{t('contactDesk')}</h2>
            <p className="section-desc">
              {t('contactDesc')}
            </p>
          </div>

          <div className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '4rem',
            alignItems: 'start',
            marginTop: '1.5rem'
          }}>
            {/* Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {t('headquarters')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('hqDesc')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--accent-gold-light)', 
                    color: 'var(--accent-gold-hover)'
                  }} className="flex-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>{t('officeAddress')}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {t('addressText')}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--accent-gold-light)', 
                    color: 'var(--accent-gold-hover)'
                  }} className="flex-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>{t('emailDesk')}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <a href="mailto:info@trivaltor.com" style={{ textDecoration: 'underline' }}>info@trivaltor.com</a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--accent-gold-light)', 
                    color: 'var(--accent-gold-hover)'
                  }} className="flex-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>{t('phoneNo')}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      +91 (484) 285-9000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form with full Address fields (State, District, City/Village, Pincode) */}
            <div className="form-container-card" style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              padding: '2.5rem',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {submitSuccess ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '2rem 0',
                  gap: '1rem',
                  color: 'var(--success)'
                }}>
                  <CheckCircle2 size={48} />
                  <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    {t('formSuccess')}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '320px' }}>
                    {t('formSuccessDesc')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactName">{t('formName')}</label>
                      <input 
                        type="text" 
                        id="contactName"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required 
                        placeholder="John Doe"
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactEmail">{t('formEmail')}</label>
                      <input 
                        type="email" 
                        id="contactEmail"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required 
                        placeholder="john@example.com"
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contactSubject">{t('formSubject')}</label>
                    <input 
                      type="text" 
                      id="contactSubject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required 
                      placeholder="e.g. Bulk Green Cardamom Price Inquiry"
                      className="form-input" 
                    />
                  </div>

                  {/* Enhanced Address Fields Grid */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactState">{t('state')}</label>
                      <input 
                        type="text" 
                        id="contactState"
                        name="state"
                        value={contactForm.state}
                        onChange={handleContactChange}
                        required 
                        placeholder="e.g. Maharashtra"
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactDistrict">{t('district')}</label>
                      <input 
                        type="text" 
                        id="contactDistrict"
                        name="district"
                        value={contactForm.district}
                        onChange={handleContactChange}
                        required 
                        placeholder="e.g. Nashik"
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactCity">{t('cityVillage')}</label>
                      <input 
                        type="text" 
                        id="contactCity"
                        name="cityVillage"
                        value={contactForm.cityVillage}
                        onChange={handleContactChange}
                        required 
                        placeholder="e.g. Yeola"
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactPincode">{t('pincode')}</label>
                      <input 
                        type="text" 
                        id="contactPincode"
                        name="pincode"
                        value={contactForm.pincode}
                        onChange={handleContactChange}
                        required 
                        placeholder="e.g. 423401"
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contactMessage">{t('formMessage')}</label>
                    <textarea 
                      id="contactMessage"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required 
                      placeholder="Write your message here..."
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem', height: '52px' }}
                  >
                    {loading ? t('formSubmitting') : (
                      <>
                        <Send size={16} /> {t('formSubmit')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
