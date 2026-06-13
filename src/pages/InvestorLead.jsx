import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useLanguage } from '../context/LanguageContext';
import { config } from '../services/config';
import { Landmark, CheckCircle2, ArrowLeft, Download, FileText } from 'lucide-react';

// Import presentation PDF
import presentationPdf from '../assets/docs/Tirvaltor main.pdf';

export const InvestorLead = () => {
  const { submitInvestorLead, loading } = useLeads();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    estimatedInvestmentAmount: '',
    currency: 'USD',
    state: '',
    district: '',
    cityVillage: '',
    pincode: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setForm((prev) => ({
      ...prev,
      currency: selectedCurrency,
      estimatedInvestmentAmount: '' // Reset select value on currency change
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await submitInvestorLead(form);
    if (res.success) {
      setSuccess(true);
      setForm({
        name: '',
        phone: '',
        email: '',
        estimatedInvestmentAmount: '',
        currency: 'USD',
        state: '',
        district: '',
        cityVillage: '',
        pincode: '',
        message: ''
      });
    }
  };

  // Get brackets based on selected currency
  const activeBrackets = config.investmentBrackets[form.currency] || [];

  return (
    <div className="investor-lead-page section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
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
            <Landmark size={14} /> {t('strategicFinancing')}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {t('investorHeader')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
            {t('investorSub')}
          </p>
        </div>

        {/* Prospectus Download Banner */}
        <div className="download-docs-banner" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--accent-gold-light)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--border-radius-md)',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--accent-gold-hover)' }}>
              <FileText size={36} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: '0', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {t('presentationTitle')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                {t('presentationDesc')}
              </p>
            </div>
          </div>
          <a 
            href={presentationPdf} 
            download="Trivaltor_Group_Presentation.pdf" 
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={14} /> {t('downloadPresentation')}
          </a>
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
                {t('investorSuccess')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('investorSuccessDesc')}
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
                  <label className="form-label" htmlFor="investorName">{t('formName')}</label>
                  <input 
                    type="text" 
                    id="investorName"
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Sarah Jenkins" 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="investorPhone">{t('phoneNoInvestor')}</label>
                  <input 
                    type="tel" 
                    id="investorPhone"
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. +91 9876543210, +44 20 7946 0958, +1 555 234 5678" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="investorEmail">{t('formEmail')}</label>
                <input 
                  type="email" 
                  id="investorEmail"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="investor@funds.com" 
                  className="form-input"
                />
              </div>

              {/* Currency Selector & Dynamic Brackets */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="currency">{t('financialCurrency')}</label>
                  <select 
                    id="currency"
                    name="currency" 
                    value={form.currency} 
                    onChange={handleCurrencyChange} 
                    required 
                    className="form-select"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="estimatedInvestmentAmount">{t('estimatedInvestment')}</label>
                  <select 
                    id="estimatedInvestmentAmount"
                    name="estimatedInvestmentAmount" 
                    value={form.estimatedInvestmentAmount} 
                    onChange={handleChange} 
                    required 
                    className="form-select"
                  >
                    <option value="">{t('selectInvestment')}</option>
                    {activeBrackets.map((bracket) => (
                      <option key={bracket.value} value={bracket.value}>
                        {bracket.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                    required 
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
                    required 
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
                    required 
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
                    required 
                    placeholder="e.g. 91101, 400001" 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="investorMessage">{t('inquirySpecsInvestor')}</label>
                <textarea 
                  id="investorMessage"
                  name="message" 
                  value={form.message} 
                  onChange={handleChange} 
                  required 
                  placeholder="Describe your investment goals, partnership interests, expected ROI, strategic interests, infrastructure requirements, or any additional details." 
                  className="form-textarea"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', height: '52px' }}
              >
                {loading ? t('formSubmitting') : t('investorSubmit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
