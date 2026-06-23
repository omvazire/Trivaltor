import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCategoryById } from '../config/categories';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.94, 
    y: 25 
  },
  visible: (i) => ({ 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1],
      delay: (i % 4) * 0.08
    }
  })
};

export const CategoryDetail = () => {
  const { categoryId } = useParams();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const category = getCategoryById(categoryId);

  const categoryProducts = category ? (category.products || []) : [];

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="section" style={{ minHeight: '60vh', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <h2>Category not found</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
            {t('backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  // Get active translation fields
  const categoryName = category.name[language] || category.name['en'];
  const categoryDesc = category.description[language] || category.description['en'];

  return (
    <div className="category-detail-page" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh', paddingBottom: '5rem' }}>
      {/* Category Banner */}
      <div className="category-detail-banner">
        <img src={category.bannerImage} alt={categoryName} />
        <div className="category-detail-banner-overlay">
          <div className="container">
            <div className="category-detail-banner-content animate-fade-in">
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#eae5da', marginBottom: '1.5rem', fontWeight: '600' }}>
                <ArrowLeft size={16} /> {t('backToHome')}
              </Link>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {categoryName}
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#ffffff', maxWidth: '640px', lineHeight: '1.6' }}>
                {categoryDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <div className="container" style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem', color: 'var(--text-primary)', borderBottom: '2px solid #0c2d1c', paddingBottom: '0.5rem', display: 'inline-block' }}>
          {t('productListTitle')}
        </h2>

        {categoryId === 'export-produce' && (
          <div className="premium-card" style={{ 
            padding: '2.5rem', 
            marginBottom: '3rem', 
            borderLeft: '4px solid var(--accent-gold)',
            backgroundColor: '#0c2d1c',
            color: '#eae5da'
          }}>
            <p style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
              {language === 'mr' 
                ? "आम्ही खरेदीदाराच्या गरजेनुसार निर्यात-योग्य कृषी मालाची व्यवस्था करू शकतो." 
                : language === 'hi' 
                  ? "हम खरीदार की आवश्यकताओं के आधार पर निर्यात-गुणवत्ता वाले कृषि उत्पाद की व्यवस्था कर सकते हैं।" 
                  : "We can arrange export-quality agricultural produce based on buyer requirements."}
            </p>
            <p style={{ fontSize: '1.05rem', color: '#eae5da', opacity: '0.9', marginBottom: '0.75rem' }}>
              <strong>{language === 'mr' ? "उदाहरणे:" : language === 'hi' ? "उदाहरण:" : "Examples:"}</strong>
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', fontSize: '0.95rem', color: '#eae5da', opacity: '0.85', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>{language === 'mr' ? "द्राक्षे (Grapes)" : language === 'hi' ? "अंगूर (Grapes)" : "Grapes"}</li>
              <li>{language === 'mr' ? "मशरूम (Mushrooms)" : language === 'hi' ? "मशरूम (Mushrooms)" : "Mushrooms"}</li>
              <li>{language === 'mr' ? "शिमला मिरची (Bell Peppers)" : language === 'hi' ? "शिमला मिर्च (Bell Peppers)" : "Bell Peppers"}</li>
              <li>{language === 'mr' ? "लसूण (Garlic)" : language === 'hi' ? "लहसुन (Garlic)" : "Garlic"}</li>
              <li>{language === 'mr' ? "इतर मागणीनुसार उपलब्ध कृषी माल (Other produce on request)" : language === 'hi' ? "अनुरोध पर अन्य उत्पाद (Other produce on request)" : "Other produce on request"}</li>
            </ul>
          </div>
        )}

        <div className="category-products-grid">
          {categoryProducts.map((product, index) => {
            const productName = typeof product.name === 'object' 
              ? (product.name[language] || product.name['en']) 
              : product.name;

            return (
              <motion.div 
                key={product.id} 
                className="premium-card product-card" 
                style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                {/* Product Image */}
                <div className="product-card-image" style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                  <img 
                    src={product.image} 
                    alt={productName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} 
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                  />
                </div>

                {/* Product Info */}
                <div className="product-card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', gap: '1.25rem' }}>
                  <h3 className="product-card-title">
                    {productName}
                  </h3>

                  {category.id === 'spices' && product.shortDescription && (
                    <p className="product-card-desc">
                      {typeof product.shortDescription === 'object'
                        ? (product.shortDescription[language] || product.shortDescription['en'])
                        : product.shortDescription}
                    </p>
                  )}

                  {category.id === 'herbs' && product.shortDescription && (
                    <p className="product-card-desc" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{t('traditionalUses')}:</span>
                      <span>
                        {typeof product.shortDescription === 'object'
                          ? (product.shortDescription[language] || product.shortDescription['en'])
                          : product.shortDescription}
                      </span>
                    </p>
                  )}

                  {/* Single Enquire Button */}
                  <button 
                    onClick={() => navigate(`/buyer?product=${encodeURIComponent(productName)}`)} 
                    className="btn btn-primary btn-sm" 
                    style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: '700', width: '100%', marginTop: 'auto' }}
                  >
                    Enquire Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
