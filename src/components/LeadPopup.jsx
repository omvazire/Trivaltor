import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, User, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LeadPopup = () => {
  const t = useLanguage().t;
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup unique session ID if not exists
  useEffect(() => {
    if (!sessionStorage.getItem('trivaltor-session-id')) {
      sessionStorage.setItem('trivaltor-session-id', 'session_' + Math.random().toString(36).substring(2, 11));
    }
  }, []);

  useEffect(() => {
    // Check if popup was already shown in this session
    const shown = sessionStorage.getItem('trivaltor-lead-popup-shown');
    if (shown) return;

    // Rule 1: Show after 20 seconds on the website
    const timer = setTimeout(() => {
      const stillNotShown = !sessionStorage.getItem('trivaltor-lead-popup-shown');
      if (stillNotShown) {
        setIsOpen(true);
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Rule 2: Show immediately if user opens a category page before 20s
    const shown = sessionStorage.getItem('trivaltor-lead-popup-shown');
    if (shown) return;

    if (location.pathname.startsWith('/category/')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, [location]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('trivaltor-lead-popup-shown', 'true');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate backend response
    setTimeout(() => {
      // Log to browser console as requested by Phase 1 revisions
      console.group('%c[Lead Capture Popup Submission] SUCCESS', 'color: #3A7D44; font-weight: bold; font-size: 12px;');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Session ID:', sessionStorage.getItem('trivaltor-session-id'));
      console.log('Name:', form.name);
      console.log('Phone:', form.phone);
      console.log('Email:', form.email);
      console.log('Status: Logged to console successfully. Database integration pending (Phase 2).');
      console.groupEnd();

      setIsSubmitting(false);
      setIsOpen(false);
      sessionStorage.setItem('trivaltor-lead-popup-shown', 'true');
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>
        
        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
          {t('popupTitle')}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
          {t('popupDesc')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label" htmlFor="popupName">{t('formName')}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                id="popupName"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                placeholder="John Doe" 
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label" htmlFor="popupPhone">{t('phoneNo')}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="tel" 
                id="popupPhone"
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                placeholder="+91 98765 43210" 
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label" htmlFor="popupEmail">{t('formEmail')}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                id="popupEmail"
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com" 
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', height: '50px' }}
          >
            {isSubmitting ? t('popupSubmitting') : t('popupSubmit')}
          </button>
        </form>
      </div>
    </div>
  );
};
