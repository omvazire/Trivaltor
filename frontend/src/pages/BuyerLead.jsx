import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useLanguage } from '../context/LanguageContext';
import { Ship, CheckCircle2, ArrowLeft } from 'lucide-react';

export const BuyerLead = () => {
  const { submitBuyerLead, loading } = useLeads();
  const { t } = useLanguage();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    companyName: '',
    country: '',
    email: '',
    phone: '',
    productRequirement: '',
    requiredQuantity: '',
    targetBudget: '',
    currency: 'USD', // Default to USD
    state: '',
    district: '',
    cityVillage: '',
    pincode: '',
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
      productRequirement: prodParam || prev.productRequirement,
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
    const res = await submitBuyerLead(form);
    if (res.success) {
      setSuccess(true);
      setForm({
        name: '',
        companyName: '',
        country: '',
        email: '',
        phone: '',
        productRequirement: '',
        requiredQuantity: '',
        targetBudget: '',
        currency: 'USD',
        state: '',
        district: '',
        cityVillage: '',
        pincode: '',
        message: ''
      });
    }
  };

  return (
    <div className="buyer-lead-page section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
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
            <Ship size={14} /> {t('globalTradeDesk')}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {t('buyerHeader')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
            {t('buyerSub')}
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
                {t('buyerSuccess')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('buyerSuccessDesc')}
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
                  <label className="form-label" htmlFor="buyerName">{t('formName')}</label>
                  <input 
                    type="text" 
                    id="buyerName"
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. David Miller" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="companyName">{t('companyName')}</label>
                  <input 
                    type="text" 
                    id="companyName"
                    name="companyName" 
                    value={form.companyName} 
                    onChange={handleChange} 
                    placeholder="e.g. Apex Spices LLC" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="country">{t('country')}</label>
                  <input 
                    type="text" 
                    id="country"
                    name="country" 
                    value={form.country} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. United States" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="buyerEmail">{t('formEmail')}</label>
                  <input 
                    type="email" 
                    id="buyerEmail"
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="buyer@company.com" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="buyerPhone">{t('phoneNoBuyer')}</label>
                  <input 
                    type="tel" 
                    id="buyerPhone"
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. +91 9876543210 or +1 555 234 5678" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="productRequirement">{t('productRequirementBuyer')}</label>
                  <input 
                    type="text" 
                    id="productRequirement"
                    name="productRequirement" 
                    value={form.productRequirement} 
                    onChange={handleChange} 
                    placeholder="e.g. Alphonso Mango, Green Cardamom, Turmeric Finger" 
                    className="form-input"
                  />
                </div>
              </div>

              {/* Currency & Target Budget Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="currency">{t('financialCurrency')}</label>
                  <select 
                    id="currency"
                    name="currency" 
                    value={form.currency} 
                    onChange={handleChange} 
                    className="form-select"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="targetBudget">{t('targetBudgetBuyer')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ 
                      position: 'absolute', 
                      left: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      fontWeight: '700',
                      color: 'var(--text-secondary)'
                    }}>
                      {form.currency === 'USD' ? '$' : '₹'}
                    </span>
                    <input 
                      type="number" 
                      id="targetBudget"
                      name="targetBudget" 
                      value={form.targetBudget} 
                      onChange={handleChange} 
                      placeholder="e.g. 25000" 
                      className="form-input"
                      style={{ paddingLeft: '2rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Required Quantity Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="requiredQuantity">{t('requiredQuantity')}</label>
                <input 
                  type="text" 
                  id="requiredQuantity"
                  name="requiredQuantity" 
                  value={form.requiredQuantity} 
                  onChange={handleChange} 
                  placeholder="e.g. 5 Tons, 2000 Kg, or 1 Container" 
                  className="form-input"
                />
              </div>

              {/* Address Fields: State, District, City/Village, Pincode */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="state">{t('stateBuyer')}</label>
                  <input 
                    type="text" 
                    id="state"
                    name="state" 
                    value={form.state} 
                    onChange={handleChange} 
                    placeholder="e.g. California, Maharashtra, Ontario" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="district">{t('districtBuyer')}</label>
                  <input 
                    type="text" 
                    id="district"
                    name="district" 
                    value={form.district} 
                    onChange={handleChange} 
                    placeholder="e.g. Los Angeles County, Ernakulam District" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="cityVillage">{t('cityVillageBuyer')}</label>
                  <input 
                    type="text" 
                    id="cityVillage"
                    name="cityVillage" 
                    value={form.cityVillage} 
                    onChange={handleChange} 
                    placeholder="e.g. Pasadena, Kochi, Manchester" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pincode">{t('pincodeBuyer')}</label>
                  <input 
                    type="text" 
                    id="pincode"
                    name="pincode" 
                    value={form.pincode} 
                    onChange={handleChange} 
                    placeholder="e.g. 91101, 400001" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="buyerMessage">{t('inquirySpecsBuyer')}</label>
                <textarea 
                  id="buyerMessage"
                  name="message" 
                  value={form.message} 
                  onChange={handleChange} 
                  placeholder="Describe quantity requirements, packaging preferences, quality expectations, certifications required, delivery requirements, or any additional details." 
                  className="form-textarea"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', height: '52px' }}
              >
                {loading ? t('formSubmitting') : t('buyerSubmit')}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
