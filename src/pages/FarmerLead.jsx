import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, CheckCircle2, ArrowLeft } from 'lucide-react';

export const FarmerLead = () => {
  const { submitFarmerLead, loading } = useLeads();
  const { t } = useLanguage();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    district: '',
    cityVillage: '',
    pincode: '',
    productName: '',
    quantity: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  // Check URL query parameters to pre-fill product and pre-fill details from localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prodParam = params.get('product');
    const storedName = localStorage.getItem('trivaltor-lead-name') || '';
    const storedPhone = localStorage.getItem('trivaltor-lead-phone') || '';
    const storedEmail = localStorage.getItem('trivaltor-lead-email') || '';

    setForm((prev) => ({
      ...prev,
      productName: prodParam || prev.productName,
      name: prev.name || storedName,
      phone: prev.phone || storedPhone,
      email: prev.email || storedEmail
    }));
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await submitFarmerLead(form);
    if (res.success) {
      setSuccess(true);
      setForm({
        name: '',
        phone: '',
        email: '',
        state: '',
        district: '',
        cityVillage: '',
        pincode: '',
        productName: '',
        quantity: '',
        message: ''
      });
    }
  };

  return (
    <div className="farmer-lead-page section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Back Link */}
        <Link to="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          <ArrowLeft size={16} /> {t('backToHome')}
        </Link>

        {/* Heading */}
        <div className="lead-page-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Leaf size={14} /> {t('suppliersDesk')}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {t('farmerHeader')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
            {t('farmerSub')}
          </p>
        </div>

        {/* Success Card or Form Card */}
        <div className="form-container-card" style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '3rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {success ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '1.5rem 0',
              gap: '1.25rem'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)'
              }} className="flex-center">
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {t('farmerSuccess')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('farmerSuccessDesc')}
              </p>
              <button 
                onClick={() => setSuccess(false)} 
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem' }}
              >
                {t('submitAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">{t('formName')}</label>
                  <input 
                    type="text" 
                    id="fullName"
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Ramesh Patil" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">{t('phoneNo')}</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. +91 98765 43210" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">{t('formEmail')}</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="ramesh@example.com" 
                  className="form-input"
                />
              </div>

              {/* Address Fields: State, District, City/Village, Pincode */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="state">{t('state')}</label>
                  <input 
                    type="text" 
                    id="state"
                    name="state" 
                    value={form.state} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Maharashtra" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="district">{t('district')}</label>
                  <input 
                    type="text" 
                    id="district"
                    name="district" 
                    value={form.district} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Pune" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="cityVillage">{t('cityVillage')}</label>
                  <input 
                    type="text" 
                    id="cityVillage"
                    name="cityVillage" 
                    value={form.cityVillage} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Narayangaon" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pincode">{t('pincode')}</label>
                  <input 
                    type="text" 
                    id="pincode"
                    name="pincode" 
                    value={form.pincode} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. 410504" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="productName">{t('productName')}</label>
                  <input 
                    type="text" 
                    id="productName"
                    name="productName" 
                    value={form.productName} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Organic Turmeric" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quantity">{t('quantity')}</label>
                  <input 
                    type="text" 
                    id="quantity"
                    name="quantity" 
                    value={form.quantity} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. 1500 Kg" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">{t('cropSpecs')}</label>
                <textarea 
                  id="message"
                  name="message" 
                  value={form.message} 
                  onChange={handleChange} 
                  required 
                  placeholder="Describe your crop quality, harvest date, certifications, or delivery requests..." 
                  className="form-textarea"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', height: '52px' }}
              >
                {loading ? t('formSubmitting') : t('farmerSubmit')}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
