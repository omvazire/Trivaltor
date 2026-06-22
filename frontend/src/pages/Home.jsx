import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useLanguage } from '../context/LanguageContext';
import { useReviews } from '../context/ReviewContext';
import { categoriesData } from '../config/categories';
import { config } from '../services/config';
import { 
  Sprout, Globe2, TrendingUp, Shovel, Ship, Landmark, ArrowRight, 
  Mail, Phone, MapPin, Send, CheckCircle2, Star, Download, FileText, X,
  ShieldCheck, Award, Plane
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

// Import local assets
import heroImg from '../assets/images/export-hero.png';
import imgAgri from '../assets/images/deal-agriculture.jpg';
import imgExport from '../assets/images/deal-export.jpeg';
import imgInvest from '../assets/images/deal-invest.jpg';

// ============ PHASE 6B: Framer Motion Animation Variants ============
const premiumEasing = [0.16, 1, 0.3, 1]; // cubic-bezier(0.16, 1, 0.3, 1)

const welcomeBadgeVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: premiumEasing, delay: 0.15 }
  }
};

const maskRevealLine1 = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.9, ease: premiumEasing, delay: 0.35 }
  }
};

const maskRevealLine2 = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.9, ease: premiumEasing, delay: 0.47 }
  }
};

const maskRevealLine3 = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.9, ease: premiumEasing, delay: 0.59 }
  }
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: premiumEasing, delay: 0.72 }
  }
};

const ctaVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: premiumEasing, delay: 0.88 }
  }
};

const cardEntranceVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 1.1, ease: premiumEasing, delay: 1.08 }
  }
};

// Helper: generates entrance + perpetual float props for each badge
const getFloatBadgeProps = (index) => ({
  initial: { opacity: 0, scale: 0.85 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: [0, -(8 + index * 2), 0]
  },
  transition: {
    opacity: { duration: 0.7, delay: 1.35 + index * 0.15, ease: premiumEasing },
    scale: { duration: 0.7, delay: 1.35 + index * 0.15, ease: premiumEasing },
    y: { 
      duration: 4.0 + index * 0.6, 
      repeat: Infinity, 
      ease: 'easeInOut',
      delay: 2.1 + index * 0.2
    }
  }
});

// ============ PHASE 6C+: Mobile Trade Network Graphic ============
const MobileTradeGraphic = () => {
  return (
    <div className="mobile-trade-graphic-container">
      <svg 
        viewBox="0 0 200 200" 
        className="mobile-trade-graphic"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Globe Grid Circle */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.3" />
        
        {/* Rotating Globe Grid */}
        <g className="globe-grid">
          {/* Latitude lines */}
          <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="var(--accent-gold)" strokeWidth="0.75" opacity="0.25" />
          <ellipse cx="100" cy="100" rx="85" ry="60" fill="none" stroke="var(--accent-gold)" strokeWidth="0.75" opacity="0.2" />
          <line x1="15" y1="100" x2="185" y2="100" stroke="var(--accent-gold)" strokeWidth="0.75" opacity="0.2" />
          {/* Longitude lines */}
          <ellipse cx="100" cy="100" rx="30" ry="85" fill="none" stroke="var(--accent-gold)" strokeWidth="0.75" opacity="0.25" />
          <ellipse cx="100" cy="100" rx="60" ry="85" fill="none" stroke="var(--accent-gold)" strokeWidth="0.75" opacity="0.2" />
          <line x1="100" y1="15" x2="100" y2="185" stroke="var(--accent-gold)" strokeWidth="0.75" opacity="0.2" />
        </g>

        {/* Trade Routes (curves connecting port nodes) */}
        {/* Route 1: Top Left to Bottom Right */}
        <path d="M 45 60 Q 90 40 145 140" fill="none" strokeWidth="1.5" className="route-line" />
        {/* Route 2: Bottom Left to Top Right */}
        <path d="M 50 145 Q 110 110 150 55" fill="none" strokeWidth="1.5" className="route-line-reverse" />
        {/* Route 3: Middle Left to Middle Right */}
        <path d="M 30 100 Q 100 160 170 100" fill="none" strokeWidth="1.5" className="route-line" />
        {/* Route 4: Top Center to Bottom Center */}
        <path d="M 100 35 Q 60 100 100 165" fill="none" strokeWidth="1.25" className="route-line-reverse" />

        {/* Port Nodes (subtle mini hubs) */}
        {/* Hub 1: Mumbai/India Area (Center) */}
        <circle cx="100" cy="100" r="2.5" fill="var(--accent-gold)" />
        {/* Hub 2: East Asia Area */}
        <circle cx="150" cy="55" r="2" fill="var(--accent-gold)" />
        {/* Hub 3: Europe/Middle East Area */}
        <circle cx="45" cy="60" r="2" fill="var(--accent-gold)" />
        {/* Hub 4: Africa/Southern Ocean Area */}
        <circle cx="50" cy="145" r="2" fill="var(--accent-gold)" />
        {/* Hub 5: Australia/Pacific Area */}
        <circle cx="145" cy="140" r="2" fill="var(--accent-gold)" />
      </svg>
    </div>
  );
};

// ============ PHASE 6C+: Mobile Headline Word-by-Word Reveal ============
const renderMobileWords = (text, baseDelay = 0.2, prefersReduced = false) => {
  if (!text) return null;
  const words = text.split(/\s+/);
  return words.map((word, wordIdx) => {
    return (
      <span key={wordIdx} className="hero-word-mask" style={{ marginRight: '0.25em' }}>
        <motion.span
          className="hero-word-inner"
          variants={{
            hidden: { y: prefersReduced ? 0 : '110%' },
            visible: {
              y: '0%',
              transition: prefersReduced ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: baseDelay + wordIdx * 0.08 }
            }
          }}
        >
          {word}
        </motion.span>
      </span>
    );
  });
};

export const Home = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { approvedReviews: reviews, addReview, fetchApprovedReviews } = useReviews();
  const contactSectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    const listener = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);  // Review Form States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    type: 'Farmer', // 'Farmer' | 'Buyer' | 'Investor'
    rating: 5,
    message: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // ============ PHASE 6B: Animation Refs & Hooks ============
  const heroSectionRef = useRef(null);
  const scrollRevealRefs = useRef([]);

  // Collect scroll-reveal element refs (used by sections below hero)
  const addScrollRevealRef = useCallback((el) => {
    if (el && !scrollRevealRefs.current.includes(el)) {
      scrollRevealRefs.current.push(el);
    }
  }, []);

  // Phase 6B: Scroll-based hero parallax (hero content drifts up on scroll)
  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 600], [0, -60]);

  useEffect(() => {
    fetchApprovedReviews();
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Phase 6B: Scroll reveal via IntersectionObserver (triggers once per element)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      scrollRevealRefs.current.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    scrollRevealRefs.current.forEach(el => observer.observe(el));

    return () => observer.disconnect();
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
      {/* 1. Hero Section – Phase 6B: Modern Interactive Hero */}
      <section ref={heroSectionRef} className="section hero-section hero-6b" style={{ 
        paddingTop: isMobile ? '3.25rem' : '5rem',
        paddingBottom: isMobile ? '3.25rem' : '5rem'
      }}>
        {/* Background gradient mesh depth */}
        <div className="hero-bg-mesh" aria-hidden="true">
          <div className="hero-mesh-orb hero-mesh-orb-1" />
          <div className="hero-mesh-orb hero-mesh-orb-2" />
          <div className="hero-mesh-orb hero-mesh-orb-3" />
        </div>
        {/* Mobile background blur */}
        {isMobile && <div className="hero-mobile-blur" aria-hidden="true" />}

        <motion.div 
          className="container hero-container" 
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
            gap: isMobile ? '1.5rem' : '4rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            y: isMobile ? 0 : heroContentY
          }}
        >
          {/* Hero Left (Text & CTAs) */}
          <motion.div 
            className="hero-text-content" 
            initial="hidden"
            animate="visible"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              alignItems: isMobile ? 'center' : 'flex-start',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {/* Welcome tag */}
            <motion.span className="section-tag" variants={welcomeBadgeVariants}>
              {t('welcomeTag')}
            </motion.span>

            {/* Headline with cinematic mask reveal */}
            {!isMobile ? (
              <h1 className="hero-title" style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800', 
                lineHeight: '1.15', 
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em'
              }}>
                <span className="hero-line-mask">
                  <motion.span className="hero-line-inner" variants={maskRevealLine1}>
                    {t('heroTitle').split(',')[0]},
                  </motion.span>
                </span>
                <span className="hero-line-mask">
                  <motion.span className="hero-line-inner" variants={maskRevealLine2} style={{ color: 'var(--accent-gold)' }}>
                    {t('heroTitle').split(',')[1]}
                  </motion.span>
                </span>
                <span className="hero-line-mask">
                  <motion.span className="hero-line-inner" variants={maskRevealLine3}>
                    {language === 'mr' ? 'आणि' : '&'} {t('heroTitle').split(',')[2] || (language === 'mr' ? 'धोरणात्मक गुंतवणूकदार' : 'Strategic Investors')}
                  </motion.span>
                </span>
              </h1>
            ) : (
              <h1 className="hero-title" style={{ 
                fontSize: '2.35rem', 
                fontWeight: '800', 
                lineHeight: '1.2', 
                color: 'var(--text-primary)',
                letterSpacing: '-0.025em',
                textAlign: 'center',
                margin: 0
              }}>
                <span style={{ display: 'block' }}>
                  {renderMobileWords(t('heroTitle').split(',')[0] + ',', 0.35, prefersReduced)}
                </span>
                <span style={{ display: 'block', color: 'var(--accent-gold)' }}>
                  {renderMobileWords(t('heroTitle').split(',')[1], 0.55, prefersReduced)}
                </span>
                <span style={{ display: 'block' }}>
                  {renderMobileWords((language === 'mr' ? 'आणि ' : '& ') + (t('heroTitle').split(',')[2] || (language === 'mr' ? 'धोरणात्मक गुंतवणूकदार' : 'Strategic Investors')), 0.75, prefersReduced)}
                </span>
              </h1>
            )}

            {/* Mobile Trust Floating Badges */}
            {isMobile && (
              <motion.div 
                className="mobile-badges-container"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 1.35 } }
                }}
              >
                <motion.div 
                  className="mobile-float-badge"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      y: prefersReduced ? 0 : [0, -4, 0],
                      transition: {
                        y: prefersReduced ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        default: { duration: prefersReduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }
                      }
                    }
                  }}
                >
                  <Globe2 size={13} /> {language === 'mr' ? 'जागतिक निर्यात' : 'Global Export'}
                </motion.div>
                <motion.div 
                  className="mobile-float-badge"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      y: prefersReduced ? 0 : [0, -4, 0],
                      transition: {
                        y: prefersReduced ? {} : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 },
                        default: { duration: prefersReduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }
                      }
                    }
                  }}
                >
                  <Award size={13} /> {language === 'mr' ? 'MSME नोंदणीकृत' : 'MSME Registered'}
                </motion.div>
                <motion.div 
                  className="mobile-float-badge"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      y: prefersReduced ? 0 : [0, -4, 0],
                      transition: {
                        y: prefersReduced ? {} : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                        default: { duration: prefersReduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }
                      }
                    }
                  }}
                >
                  <ShieldCheck size={13} /> {language === 'mr' ? 'FSSAI प्रमाणित' : 'FSSAI Certified'}
                </motion.div>
                <motion.div 
                  className="mobile-float-badge"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      y: prefersReduced ? 0 : [0, -4, 0],
                      transition: {
                        y: prefersReduced ? {} : { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.45 },
                        default: { duration: prefersReduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }
                      }
                    }
                  }}
                >
                  <Ship size={13} /> {language === 'mr' ? 'आंतरराष्ट्रीय व्यापार' : 'International Trade'}
                </motion.div>
              </motion.div>
            )}
            {/* Description */}
            <motion.p className="hero-desc-p" variants={descriptionVariants} style={{ 
              fontSize: isMobile ? '1.05rem' : '1.25rem', 
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              maxWidth: '540px',
              margin: 0
            }}>
              {t('heroDesc')}
            </motion.p>

            {/* Mobile Trade Network Graphic with Floating Icons */}
            {isMobile && (
              <div className="mobile-trade-graphic-container">
                <div className="floating-export-icon floating-icon-1">
                  <Globe2 size={20} />
                </div>
                <div className="floating-export-icon floating-icon-2">
                  <Ship size={20} />
                </div>
                <div className="floating-export-icon floating-icon-3">
                  <Plane size={20} />
                </div>
                <MobileTradeGraphic />
              </div>
            )}
            
            {/* Hero CTAs */}
            {!isMobile ? (
              <motion.div className="hero-ctas-wrapper" variants={ctaVariants} style={{ 
                display: 'flex', 
                gap: '1rem', 
                flexWrap: 'wrap', 
                marginTop: '1.5rem' 
              }}>
                <button 
                  onClick={() => navigate('/farmer')} 
                  className="btn btn-primary hero-cta-btn"
                  style={{ flex: '1', minWidth: '160px' }}
                >
                  {t('iAmFarmer')}
                </button>
                <button 
                  onClick={() => navigate('/buyer')} 
                  className="btn btn-secondary hero-cta-btn"
                  style={{ flex: '1', minWidth: '160px' }}
                >
                  {t('iAmBuyer')}
                </button>
                <button 
                  onClick={() => navigate('/investor')} 
                  className="btn btn-dark hero-cta-btn"
                  style={{ flex: '1', minWidth: '160px' }}
                >
                  {t('iAmInvestor')}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                className="hero-ctas-wrapper" 
                variants={{
                  hidden: { opacity: 0, scale: 0.96 },
                  visible: { 
                    opacity: 1, 
                    scale: prefersReduced ? 1 : [0.96, 1.02, 1],
                    transition: { 
                      duration: prefersReduced ? 0 : 0.8, 
                      delay: prefersReduced ? 0 : 0.88,
                      ease: premiumEasing
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.75rem', 
                  width: '100%',
                  marginTop: '0.5rem' 
                }}
              >
                <motion.button 
                  whileTap={prefersReduced ? {} : { scale: 0.96 }}
                  onClick={() => navigate('/farmer')} 
                  className="btn btn-primary hero-cta-btn cta-shine"
                  style={{ width: '100%' }}
                >
                  {t('iAmFarmer')}
                </motion.button>
                <motion.button 
                  whileTap={prefersReduced ? {} : { scale: 0.96 }}
                  onClick={() => navigate('/buyer')} 
                  className="btn btn-secondary hero-cta-btn"
                  style={{ width: '100%' }}
                >
                  {t('iAmBuyer')}
                </motion.button>
                <motion.button 
                  whileTap={prefersReduced ? {} : { scale: 0.96 }}
                  onClick={() => navigate('/investor')} 
                  className="btn btn-dark hero-cta-btn"
                  style={{ width: '100%' }}
                >
                  {t('iAmInvestor')}
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Hero Right (3D Interactive Card Scene) */}
          {!isMobile && (
            <motion.div 
              className="hero-3d-scene"
              initial="hidden"
              animate="visible"
              variants={cardEntranceVariants}
            >
              <Tilt
                tiltMaxAngleX={6}
                tiltMaxAngleY={6}
                perspective={1000}
                scale={1.02}
                transitionSpeed={1500}
                gyroscope={false}
                className="hero-tilt-wrapper"
              >
                <div className="hero-card-3d">
                  <img 
                    src={heroImg} 
                    alt="Trivaltor Corporate presentation" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Overlay Gradient for premium feel */}
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
              </Tilt>

              {/* Floating Trust Badges — glassmorphism, independent float cycles */}
              <motion.div className="hero-float-badge hero-badge-1" {...getFloatBadgeProps(0)}>
                <Globe2 size={16} /> Export Ready
              </motion.div>
              <motion.div className="hero-float-badge hero-badge-2" {...getFloatBadgeProps(1)}>
                <ShieldCheck size={16} /> FSSAI Certified
              </motion.div>
              <motion.div className="hero-float-badge hero-badge-3" {...getFloatBadgeProps(2)}>
                <Award size={16} /> MSME Registered
              </motion.div>
              <motion.div className="hero-float-badge hero-badge-4" {...getFloatBadgeProps(3)}>
                <Ship size={16} /> Global Trade
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* 2. About Section (Three Pillars) */}
      <section id="about" className="section about-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div ref={addScrollRevealRef} className="scroll-reveal-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <div ref={addScrollRevealRef} className="premium-card scroll-reveal" style={{ '--stagger-index': 0 }}>
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
            <div ref={addScrollRevealRef} className="premium-card scroll-reveal" style={{ '--stagger-index': 1 }}>
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
            <div ref={addScrollRevealRef} className="premium-card scroll-reveal" style={{ '--stagger-index': 2 }}>
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
          <div ref={addScrollRevealRef} className="scroll-reveal-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <div ref={addScrollRevealRef} className="premium-card scroll-reveal" style={{ padding: '0', overflow: 'hidden', '--stagger-index': 0 }}>
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
            <div ref={addScrollRevealRef} className="premium-card scroll-reveal" style={{ padding: '0', overflow: 'hidden', '--stagger-index': 1 }}>
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
            <div ref={addScrollRevealRef} className="premium-card scroll-reveal" style={{ padding: '0', overflow: 'hidden', '--stagger-index': 2 }}>
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
          <div ref={addScrollRevealRef} className="scroll-reveal-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('categoriesTitle')}</span>
            <h2 className="section-title">{t('categoriesTitle')}</h2>
            <p className="section-desc">
              {t('categoriesDesc')}
            </p>
          </div>

          <div className="categories-grid">
            {categoriesData.map((category, index) => {
              const catName = category.name[language] || category.name['en'];
              const catDesc = category.description[language] || category.description['en'];
              
              return (
                <div key={category.id} ref={addScrollRevealRef} className="category-card scroll-reveal" style={{ '--stagger-index': index }}>
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
          <div ref={addScrollRevealRef} className="scroll-reveal-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag">{t('videoTag')}</span>
            <h2 className="section-title">{t('videoTitle')}</h2>
            <p className="section-desc" style={{ marginBottom: '0' }}>
              {t('videoDesc')}
            </p>
          </div>

          <div ref={addScrollRevealRef} className="video-wrapper scroll-reveal">
            <iframe
              src={config.youtubeEmbedUrl}
              title={t('videoTitle')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
      {/* 7. Reviews Section */}
      <section id="testimonials" className="section reviews-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div ref={addScrollRevealRef} className="scroll-reveal-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-tag">{t('reviewsTag')}</span>
            <h2 className="section-title">{t('reviewsTitle')}</h2>
            <p className="section-desc" style={{ marginBottom: '1.5rem' }}>{t('reviewsDesc')}</p>
          </div>
        </div>

        <div ref={addScrollRevealRef} className="reviews-marquee-container scroll-reveal">
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
          <div ref={addScrollRevealRef} className="scroll-reveal-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <div ref={addScrollRevealRef} className="scroll-reveal contact-details-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
            <div ref={addScrollRevealRef} className="form-container-card scroll-reveal contact-form-reveal" style={{
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
