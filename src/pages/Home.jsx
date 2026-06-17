import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useLanguage } from '../context/LanguageContext';
import { useReviews } from '../context/ReviewContext';
import { categoriesData } from '../services/categoriesData';
import { config } from '../services/config';
import { 
  Sprout, Globe2, TrendingUp, Shovel, Ship, Landmark, ArrowRight, 
  Mail, Phone, MapPin, Send, CheckCircle2, Star, Download, FileText, X
} from 'lucide-react';

// Import local assets
import heroImg from '../assets/images/export-hero.png';
import imgAgri from '../assets/images/deal-agriculture.jpg';
import imgExport from '../assets/images/deal-export.jpeg';
import imgInvest from '../assets/images/deal-invest.jpg';
import udyamCertImg from '../assets/images/udyam certificate.jpeg';
import fssaiCertImg from '../assets/images/certificate.jpeg';

export const Home = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { reviews, addReview } = useReviews();
  const contactSectionRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Review Form States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    type: 'Farmer', // 'Farmer' | 'Buyer' | 'Investor'
    rating: 5,
    message: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Contact Form State simplified
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setContactForm({ 
      name: '', 
      email: '', 
      message: ''
    });
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        customerName: reviewForm.name,
        reviewerType: reviewForm.type,
        rating: reviewForm.rating,
        reviewText: reviewForm.message,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setReviewForm({
        name: '',
        type: 'Farmer',
        rating: 5,
        message: ''
      });
      setReviewSubmitted(true);
    } catch (err) {
      console.error('Failed to submit review:', err);
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

      {/* 6. Certifications & Registrations Section */}
      <section id="credibility" className="section credibility-section" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
            <span className="section-tag">{t('credibilityTag')}</span>
            <h2 className="section-title">{t('credibilityTitle')}</h2>
            <p className="section-desc">
              {t('credibilityDesc')}
            </p>
          </div>

          <div className="credibility-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem', 
            alignItems: 'stretch'
          }}>
            {/* Card A: UDYAM */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
              <div 
                onClick={() => setPreviewImage(udyamCertImg)}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: 'var(--border-radius-sm)', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Click to preview certificate"
              >
                <img 
                  src={udyamCertImg} 
                  alt="Udyam Registration Certificate" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  UDYAM REGISTRATION CERTIFICATE
                </h3>
                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-gold-hover)', margin: 0 }}>
                  Udyam Registered Enterprise
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  <strong>Registration No:</strong> <br />
                  <code style={{ fontSize: '0.95rem', color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.25rem' }}>
                    UDYAM-MH-33-0703853
                  </code>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'auto', margin: 0 }}>
                  Government Recognized MSME
                </p>
              </div>
            </div>

            {/* Card B: FSSAI */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
              <div 
                onClick={() => setPreviewImage(fssaiCertImg)}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: 'var(--border-radius-sm)', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Click to preview certificate"
              >
                <img 
                  src={fssaiCertImg} 
                  alt="FSSAI Registration" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  FSSAI REGISTRATION
                </h3>
                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-gold-hover)', margin: 0 }}>
                  FSSAI Registered Business
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  <strong>Registration No:</strong> <br />
                  <code style={{ fontSize: '0.95rem', color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.25rem' }}>
                    21526022000048
                  </code>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'auto', margin: 0 }}>
                  <strong>Valid Until:</strong> 04-01-2027
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 7. Reviews Section */}
      <section id="testimonials" className="section reviews-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('reviewsTag')}</span>
            <h2 className="section-title">{t('reviewsTitle')}</h2>
            <p className="section-desc" style={{ marginBottom: '1.5rem' }}>{t('reviewsDesc')}</p>
          </div>
        </div>

        <div className="reviews-marquee-container">
          <div className="reviews-marquee-track">
            <div className="reviews-marquee-content">
              {reviews.filter(r => r.status === 'approved').map(review => (
                <div key={review.id} className="review-card">
                  <div className="stars-container">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={16} 
                        fill={idx < review.rating ? "currentColor" : "none"} 
                        stroke={idx < review.rating ? "none" : "currentColor"} 
                      />
                    ))}
                  </div>
                  <div className="review-author" style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                    {review.customerName}
                  </div>
                  {review.reviewerType && review.reviewerType !== "Customer" && (
                    <div className="review-type" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>
                      {review.reviewerType}
                    </div>
                  )}
                  <p className="review-text" style={{ fontStyle: 'italic', margin: '0' }}>"{review.reviewText}"</p>
                </div>
              ))}
            </div>
            <div className="reviews-marquee-content" aria-hidden="true">
              {reviews.filter(r => r.status === 'approved').map(review => (
                <div key={`dup-${review.id}`} className="review-card">
                  <div className="stars-container">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={16} 
                        fill={idx < review.rating ? "currentColor" : "none"} 
                        stroke={idx < review.rating ? "none" : "currentColor"} 
                      />
                    ))}
                  </div>
                  <div className="review-author" style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                    {review.customerName}
                  </div>
                  {review.reviewerType && review.reviewerType !== "Customer" && (
                    <div className="review-type" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>
                      {review.reviewerType}
                    </div>
                  )}
                  <p className="review-text" style={{ fontStyle: 'italic', margin: '0' }}>"{review.reviewText}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => setShowReviewModal(true)} 
              className="btn btn-primary"
              style={{ padding: '0.75rem 2.5rem', fontWeight: '700' }}
            >
              {t('leaveReviewBtn')}
            </button>
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
                    color: 'var(--accent-gold-hover)',
                    flexShrink: 0
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
                    color: 'var(--accent-gold-hover)',
                    flexShrink: 0
                  }} className="flex-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>{t('emailDesk')}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <a href="mailto:trivaltorgoc@gmail.com" style={{ textDecoration: 'underline' }}>trivaltorgoc@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--accent-gold-light)', 
                    color: 'var(--accent-gold-hover)',
                    flexShrink: 0
                  }} className="flex-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>{t('phoneNo')}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <a href="tel:+919226941613" style={{ textDecoration: 'underline' }}>+91 92269 41613</a>
                      <a href="tel:+919324027876" style={{ textDecoration: 'underline' }}>+91 93240 27876</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Simplified to Name, Email, Message */}
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
                      rows="4"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem', height: '52px' }}
                  >
                    <Send size={16} /> {t('formSubmit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Preview Modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <div 
            className="modal-container" 
            style={{ 
              maxWidth: '800px', 
              padding: '1.5rem', 
              backgroundColor: '#fff', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close" 
              onClick={() => setPreviewImage(null)} 
              aria-label="Close preview"
              style={{ top: '1rem', right: '1rem', zIndex: 10 }}
            >
              <X size={24} />
            </button>
            <div style={{ width: '100%', maxHeight: '80vh', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={previewImage} 
                alt="Certificate Preview" 
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Leave Your Review Form Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => {
          setShowReviewModal(false);
          setReviewSubmitted(false);
        }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => {
                setShowReviewModal(false);
                setReviewSubmitted(false);
              }} 
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {reviewSubmitted ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 0',
                gap: '1.5rem',
                color: 'var(--success)'
              }}>
                <CheckCircle2 size={48} />
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  {t('formSuccess') || 'Submission Successful'}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Thank you. Your review has been submitted and will be published after verification.
                </p>
                <button 
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewSubmitted(false);
                  }}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', padding: '0.6rem 2rem' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                  {t('reviewFormTitle') || 'Submit Your Review'}
                </h2>
                
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" htmlFor="reviewName">{t('formName') || 'Full Name'}</label>
                    <input 
                      type="text" 
                      id="reviewName"
                      name="name" 
                      value={reviewForm.name} 
                      onChange={handleReviewChange} 
                      required 
                      placeholder="e.g. John Doe" 
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" htmlFor="reviewType">{t('reviewTypeName') || 'Review Type'}</label>
                    <select 
                      id="reviewType"
                      name="type" 
                      value={reviewForm.type} 
                      onChange={handleReviewChange} 
                      className="form-input"
                      style={{ height: '48px', appearance: 'auto' }}
                    >
                      <option value="Farmer">{t('reviewTypeFarmer') || 'Farmer'}</option>
                      <option value="Buyer">{t('reviewTypeBuyer') || 'Buyer'}</option>
                      <option value="Investor">{t('reviewTypeInvestor') || 'Investor'}</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>{t('reviewRating') || 'Rating'}</label>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            color: star <= reviewForm.rating ? '#e0a96d' : 'var(--text-muted)'
                          }}
                        >
                          <Star size={24} fill={star <= reviewForm.rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" htmlFor="reviewMessage">{t('reviewMessage') || 'Message'}</label>
                    <textarea 
                      id="reviewMessage"
                      name="message" 
                      value={reviewForm.message} 
                      onChange={handleReviewChange} 
                      required 
                      placeholder="Share your experience working with us..." 
                      className="form-textarea"
                      rows="4"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem', height: '50px' }}
                  >
                    {t('reviewSubmit') || 'Submit'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
