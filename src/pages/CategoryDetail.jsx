import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCategoryById } from '../services/categoriesData';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

export const CategoryDetail = () => {
  const { categoryId } = useParams();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const category = getCategoryById(categoryId);

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
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--accent-gold)', paddingBottom: '0.5rem', display: 'inline-block' }}>
          {t('productListTitle')}
        </h2>

        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {category.products.map((product) => {
            const productName = product.name[language] || product.name['en'];
            const productDesc = product.description[language] || product.description['en'];

            return (
              <div key={product.id} className="premium-card product-card animate-fade-in" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Product Image */}
                <div className="product-card-image" style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                  <img 
                    src={product.image} 
                    alt={productName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} 
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    right: '1rem', 
                    backgroundColor: 'rgba(12, 45, 28, 0.85)', 
                    color: 'var(--accent-gold)', 
                    padding: '0.25rem 0.75rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--accent-gold)'
                  }}>
                    {categoryName}
                  </div>
                </div>

                {/* Product Info */}
                <div className="product-card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {productName}
                  </h3>
                  
                  <p className="product-card-desc" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexGrow: 1, lineHeight: '1.5' }}>
                    {productDesc}
                  </p>

                  {/* Action Buttons */}
                  <div className="product-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto' }}>
                    <button 
                      onClick={() => navigate(`/buyer?product=${encodeURIComponent(productName)}`)} 
                      className="btn btn-primary btn-sm" 
                      style={{ padding: '0.75rem', fontSize: '0.8rem', fontWeight: '700' }}
                    >
                      {t('inquireBuyer')}
                    </button>
                    
                    <button 
                      onClick={() => navigate(`/farmer?product=${encodeURIComponent(productName)}`)} 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '0.75rem', fontSize: '0.8rem', fontWeight: '700' }}
                    >
                      {t('inquireFarmer')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
