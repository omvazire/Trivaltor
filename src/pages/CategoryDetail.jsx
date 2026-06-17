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
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--accent-gold)', paddingBottom: '0.5rem', display: 'inline-block' }}>
          {t('productListTitle')}
        </h2>

        <div className="category-products-grid">
          {categoryProducts.map((product) => {
            const productName = typeof product.name === 'object' 
              ? (product.name[language] || product.name['en']) 
              : product.name;

            return (
              <div key={product.id} className="premium-card product-card animate-fade-in" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
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

                  {/* Single Enquire Button */}
                  <button 
                    onClick={() => navigate(`/buyer?product=${encodeURIComponent(productName)}`)} 
                    className="btn btn-primary btn-sm" 
                    style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: '700', width: '100%', marginTop: 'auto' }}
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
