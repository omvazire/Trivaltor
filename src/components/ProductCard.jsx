import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleInquireBuyer = () => {
    navigate(`/buyer?product=${encodeURIComponent(product.name)}`);
  };

  const handleInquireFarmer = () => {
    navigate(`/farmer?product=${encodeURIComponent(product.name)}`);
  };

  return (
    <div className="premium-card product-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image Container */}
      <div className="product-card-image" style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} 
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
          onError={(e) => {
            // Fallback text image if import fails
            e.target.style.display = 'none';
          }}
        />
        <div style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem', 
          backgroundColor: 'rgba(31, 27, 22, 0.75)', 
          backdropFilter: 'blur(4px)',
          color: '#ffffff', 
          padding: '0.25rem 0.75rem', 
          fontSize: '0.75rem', 
          fontWeight: '600', 
          borderRadius: '4px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          {product.category}
        </div>
      </div>

      {/* Product Information */}
      <div className="product-card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
        
        <p className="product-card-desc" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexGrow: 1 }}>
          {product.description}
        </p>

        {/* Action Buttons */}
        <div className="product-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto' }}>
          <button 
            onClick={handleInquireBuyer} 
            className="btn btn-primary btn-sm" 
            style={{ padding: '0.65rem', fontSize: '0.8rem', fontWeight: '700' }}
          >
            I Am A Buyer
          </button>
          
          <button 
            onClick={handleInquireFarmer} 
            className="btn btn-secondary btn-sm" 
            style={{ padding: '0.65rem', fontSize: '0.8rem', fontWeight: '700' }}
          >
            I Am A Farmer
          </button>
        </div>
      </div>
    </div>
  );
};

