import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useReviews } from '../context/ReviewContext';
import { api } from '../services/api';
import { 
  Users, Download, LogOut, Lock, 
  Search, ArrowUpDown, Eye, Check, X,
  MessageSquare, Calendar, ThumbsUp, ThumbsDown,
  Trash2
} from 'lucide-react';

const unescape = (str) => {
  if (str === null || str === undefined || String(str).trim() === '') {
    return 'N/A';
  }
  if (typeof str !== 'string') return String(str);
  
  const decoded = str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x3D;/g, '=')
    .replace(/&#96;/g, '`');
    
  return decoded.trim() === '' || decoded === 'N/A' ? 'N/A' : decoded;
};

export const AdminDashboard = () => {
  const { 
    farmerLeads = [], 
    buyerLeads = [], 
    investorLeads = [], 
    contactLeads = [],
    popupLeads = [],
    paginationFarmer,
    paginationBuyer,
    paginationInvestor,
    paginationContact,
    paginationPopup,
    loading: leadsLoading,
    fetchEnquiries,
    fetchPopupLeads,
    deleteLead, 
    markLeadContacted,
    deletePopupLead
  } = useLeads();

  const { 
    reviews = [], 
    paginationReviews,
    fetchReviews,
    approveReview, 
    rejectReview, 
    deleteReview 
  } = useReviews();

  const navigate = useNavigate();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);

  // Main navigation tab: 'enquiries' | 'popupLeads' | 'reviews'
  const [activeSection, setActiveSection] = useState('enquiries');

  // Enquiries sub-tab: 'farmer' | 'buyer' | 'investor'
  const [activeEnquiryTab, setActiveEnquiryTab] = useState('farmer');

  // Review status filter: 'all' | 'pending' | 'approved' | 'rejected'
  const [reviewFilter, setReviewFilter] = useState('all');

  // Search & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByDateOrder, setSortByDateOrder] = useState('desc'); // 'asc' | 'desc'

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedEnquiryType, setSelectedEnquiryType] = useState('');

  // Analytics states
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await api.admin.getAnalytics();
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries('farmer', 1, 20);
    fetchEnquiries('buyer', 1, 20);
    fetchEnquiries('investor', 1, 20);
    fetchEnquiries('contact', 1, 20);
    fetchPopupLeads(1, 20);
    fetchReviews(1, 20);
    fetchAnalytics();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username.trim() === 'admin' && credentials.password.trim() === 'trivaltor123') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('trivaltor-admin-token');
    setIsLoggedIn(false);
    navigate('/admin/login');
  };

  // Secure CSV Exporter from Backend
  const handleExport = async (type) => {
    try {
      let blobData;
      let filename = '';
      if (type === 'enquiries') {
        blobData = await api.admin.exportEnquiries();
        filename = 'trivaltor_enquiries.csv';
      } else if (type === 'popup-leads') {
        blobData = await api.admin.exportPopupLeads();
        filename = 'trivaltor_popup_leads.csv';
      }

      const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[Export Error]', err);
      alert('Failed to export data: ' + (err.message || err));
    }
  };

  // Local handlers for table page changes
  const handlePageChange = (tab, page) => {
    fetchEnquiries(tab, page, 20);
  };

  const handlePopupPageChange = (page) => {
    fetchPopupLeads(page, 20);
  };

  const handleReviewPageChange = (page) => {
    fetchReviews(page, 20);
  };

  // Moderation with analytics sync
  const handleApproveReview = async (id) => {
    try {
      await approveReview(id);
      fetchAnalytics();
    } catch (err) {
      alert('Error approving review: ' + err.message);
    }
  };

  const handleRejectReview = async (id) => {
    try {
      await rejectReview(id);
      fetchAnalytics();
    } catch (err) {
      alert('Error rejecting review: ' + err.message);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      if (confirm('Are you sure you want to delete this review?')) {
        await deleteReview(id);
        fetchAnalytics();
      }
    } catch (err) {
      alert('Error deleting review: ' + err.message);
    }
  };

  // Helper to filter/sort enquiries
  const getProcessedEnquiries = () => {
    let currentLeads = [];
    if (activeEnquiryTab === 'farmer') currentLeads = [...(farmerLeads || [])];
    else if (activeEnquiryTab === 'buyer') currentLeads = [...(buyerLeads || [])];
    else currentLeads = [...(investorLeads || [])];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      currentLeads = currentLeads.filter(lead => {
        if (!lead) return false;
        if (activeEnquiryTab === 'farmer') {
          return (lead.name || '').toLowerCase().includes(q) || 
                 (lead.email || '').toLowerCase().includes(q) || 
                 (lead.productName || '').toLowerCase().includes(q) || 
                 (lead.location || '').toLowerCase().includes(q) ||
                 (lead.state || '').toLowerCase().includes(q);
        } else if (activeEnquiryTab === 'buyer') {
          return (lead.name || '').toLowerCase().includes(q) || 
                 (lead.email || '').toLowerCase().includes(q) || 
                 (lead.productRequirement || '').toLowerCase().includes(q) || 
                 (lead.companyName && lead.companyName.toLowerCase().includes(q)) ||
                 (lead.country || '').toLowerCase().includes(q);
        } else {
          return (lead.name || '').toLowerCase().includes(q) || 
                 (lead.email || '').toLowerCase().includes(q) || 
                 (lead.investmentInterest || '').toLowerCase().includes(q);
        }
      });
    }

    // Sort by Date
    currentLeads.sort((a, b) => {
      if (!a || !b) return 0;
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return sortByDateOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return currentLeads;
  };

  // Helper to filter/sort reviews
  const getProcessedReviews = () => {
    let currentReviews = [...(reviews || [])];
    
    // Status Filter
    if (reviewFilter !== 'all') {
      currentReviews = currentReviews.filter(r => r && r.status === reviewFilter);
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      currentReviews = currentReviews.filter(r => 
        r && (
          (r.customerName || '').toLowerCase().includes(q) || 
          (r.reviewText || '').toLowerCase().includes(q) ||
          (r.reviewerType || '').toLowerCase().includes(q)
        )
      );
    }

    // Sort by Date
    currentReviews.sort((a, b) => {
      if (!a || !b) return 0;
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortByDateOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return currentReviews;
  };

  const processedEnquiries = getProcessedEnquiries();
  const processedReviews = getProcessedReviews();

  // Navigation handlers inside detail modal
  const currentIndex = processedEnquiries.findIndex(lead => lead.id === selectedEnquiry?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < processedEnquiries.length - 1;

  const handlePrevEnquiry = () => {
    if (hasPrev) {
      setSelectedEnquiry(processedEnquiries[currentIndex - 1]);
    }
  };

  const handleNextEnquiry = () => {
    if (hasNext) {
      setSelectedEnquiry(processedEnquiries[currentIndex + 1]);
    }
  };

  // Safe date formatting helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString();
  };

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  // Render Stars
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '0.15rem', color: '#e0a96d' }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ fontSize: '1rem' }}>
            {i < rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  // Login view
  if (!isLoggedIn) {
    return (
      <div className="section flex-center" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '3rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-gold-light)',
            color: 'var(--accent-gold-hover)',
            margin: '0 auto 1.5rem auto'
          }} className="flex-center">
            <Lock size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Admin Security Desk
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Executive access restricted to Trivaltor trade desk managers.
          </p>

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
                placeholder="Enter admin" 
                className="form-input" 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Enter password" 
                className="form-input" 
              />
            </div>

            {loginError && (
              <p style={{ color: 'red', fontSize: '0.8rem', margin: '0.5rem 0 1rem 0' }}>
                Incorrect username or password. Please use credentials.
              </p>
            )}

            <div style={{ 
              backgroundColor: 'var(--bg-primary)', 
              border: '1px solid var(--border-color)', 
              padding: '0.75rem 1rem', 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              lineHeight: '1.4'
            }}>
              🔑 <strong>Credentials:</strong><br />
              Username: <code style={{ color: 'var(--accent-gold-hover)' }}>admin</code><br />
              Password: <code style={{ color: 'var(--accent-gold-hover)' }}>trivaltor123</code>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Authorize Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '90vh' }}>
      <div className="container">
        
        {/* Dashboard Top Header */}
        <div className="admin-header-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.5rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span className="section-tag" style={{ margin: '0' }}>Administration Dashboard</span>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Trivaltor Trade Desk
            </h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={14} /> Logout Session
          </button>
        </div>

        {/* Executive Widgets / Summary Cards */}
        <div className="admin-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card Visitors */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Visitors</span>
              <Calendar size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {analytics?.totalVisitors ?? 0}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Unique visitor sessions
            </span>
          </div>

          {/* Card Popup Leads */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--info)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Popup Leads</span>
              <MessageSquare size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {analytics?.totalPopupLeads ?? 0}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Quick callback requests
            </span>
          </div>

          {/* Card Enquiries */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold-hover)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Enquiries</span>
              <Users size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {analytics?.totalEnquiries ?? 0}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Formal desk queries
            </span>
          </div>

          {/* Card Conversion Rate */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10b981' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Lead Conversion</span>
              <Check size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {analytics?.leadConversionCount ?? 0}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Rate: {analytics?.conversionRate ?? 0}%
            </span>
          </div>

          {/* Card Pending Reviews */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Pending Reviews</span>
              <MessageSquare size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {analytics?.pendingReviewsCount ?? 0}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Requires moderation
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => { setActiveSection('enquiries'); setSearchQuery(''); }}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.05rem',
              fontWeight: '700',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeSection === 'enquiries' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
              borderBottom: activeSection === 'enquiries' ? '3px solid var(--accent-gold-hover)' : 'none',
              marginBottom: '-0.65rem'
            }}
          >
            Enquiries Desk
          </button>
          <button 
            onClick={() => { setActiveSection('popupLeads'); setSearchQuery(''); }}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.05rem',
              fontWeight: '700',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeSection === 'popupLeads' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
              borderBottom: activeSection === 'popupLeads' ? '3px solid var(--accent-gold-hover)' : 'none',
              marginBottom: '-0.65rem'
            }}
          >
            Popup Leads Desk
          </button>
          <button 
            onClick={() => { setActiveSection('reviews'); setSearchQuery(''); }}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.05rem',
              fontWeight: '700',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeSection === 'reviews' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
              borderBottom: activeSection === 'reviews' ? '3px solid var(--accent-gold-hover)' : 'none',
              marginBottom: '-0.65rem'
            }}
          >
            Reviews Desk
          </button>
        </div>

        {/* SECTION 1: ENQUIRIES */}
        {activeSection === 'enquiries' && (
          <div>
            {/* Enquiry Header & CSV */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="admin-controls-bar" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '1rem 1.5rem',
                borderRadius: '8px'
              }}>
                {/* Sub tabs */}
                <div className="admin-tabs-wrapper" style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-primary)', padding: '0.25rem', borderRadius: '6px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => { setActiveEnquiryTab('farmer'); setSearchQuery(''); }}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      borderRadius: '4px',
                      backgroundColor: activeEnquiryTab === 'farmer' ? 'var(--bg-secondary)' : 'transparent',
                      color: activeEnquiryTab === 'farmer' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Farmers ({paginationFarmer?.total ?? farmerLeads.length})
                  </button>
                  <button 
                    onClick={() => { setActiveEnquiryTab('buyer'); setSearchQuery(''); }}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      borderRadius: '4px',
                      backgroundColor: activeEnquiryTab === 'buyer' ? 'var(--bg-secondary)' : 'transparent',
                      color: activeEnquiryTab === 'buyer' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Buyers ({paginationBuyer?.total ?? buyerLeads.length})
                  </button>
                  <button 
                    onClick={() => { setActiveEnquiryTab('investor'); setSearchQuery(''); }}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      borderRadius: '4px',
                      backgroundColor: activeEnquiryTab === 'investor' ? 'var(--bg-secondary)' : 'transparent',
                      color: activeEnquiryTab === 'investor' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Investors ({paginationInvestor?.total ?? investorLeads.length})
                  </button>
                </div>

                {/* Query filters */}
                <div className="admin-actions-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search inquiries..."
                      className="form-input"
                      style={{ padding: '0.45rem 0.75rem 0.45rem 3rem', fontSize: '0.85rem', height: '36px', width: '100%' }}
                    />
                    <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>

                  <button
                    onClick={() => setSortByDateOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="btn btn-secondary btn-sm"
                    style={{ height: '36px', padding: '0 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <ArrowUpDown size={14} /> 
                    Date ({sortByDateOrder === 'desc' ? 'Newest' : 'Oldest'})
                  </button>

                  <button
                    onClick={() => handleExport('enquiries')}
                    className="btn btn-primary btn-sm"
                    style={{ height: '36px', padding: '0 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Leads Data Table */}
            <div className="table-container">
              {processedEnquiries.length > 0 ? (
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Enquiry Type</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeEnquiryTab === 'farmer' && processedEnquiries.map(lead => {
                      if (!lead) return null;
                      return (
                        <tr key={lead.id || Math.random().toString()}>
                          <td><strong>{unescape(lead.name)}</strong></td>
                          <td>Farmer</td>
                          <td><span className="badge badge-gold">{unescape(lead.productName)}</span></td>
                          <td>
                            <span className={`badge ${lead.contacted ? 'badge-success' : 'badge-gold'}`} style={{ color: lead.contacted ? 'green' : 'inherit' }}>
                              {lead.contacted ? 'Contacted' : 'New'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button 
                                title="View Details"
                                onClick={() => { setSelectedEnquiry(lead); setSelectedEnquiryType('farmer'); }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <Eye size={14} /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {activeEnquiryTab === 'buyer' && processedEnquiries.map(lead => {
                      if (!lead) return null;
                      return (
                        <tr key={lead.id || Math.random().toString()}>
                          <td><strong>{unescape(lead.name)}</strong></td>
                          <td>Buyer</td>
                          <td><span className="badge badge-gold">{unescape(lead.productRequirement)}</span></td>
                          <td>
                            <span className={`badge ${lead.contacted ? 'badge-success' : 'badge-gold'}`} style={{ color: lead.contacted ? 'green' : 'inherit' }}>
                              {lead.contacted ? 'Contacted' : 'New'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button 
                                title="View Details"
                                onClick={() => { setSelectedEnquiry(lead); setSelectedEnquiryType('buyer'); }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <Eye size={14} /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {activeEnquiryTab === 'investor' && processedEnquiries.map(lead => {
                      if (!lead) return null;
                      return (
                        <tr key={lead.id || Math.random().toString()}>
                          <td><strong>{unescape(lead.name)}</strong></td>
                          <td>Investor</td>
                          <td><span className="badge badge-gold">{unescape(lead.investmentInterest)}</span></td>
                          <td>
                            <span className={`badge ${lead.contacted ? 'badge-success' : 'badge-gold'}`} style={{ color: lead.contacted ? 'green' : 'inherit' }}>
                              {lead.contacted ? 'Contacted' : 'New'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button 
                                title="View Details"
                                onClick={() => { setSelectedEnquiry(lead); setSelectedEnquiryType('investor'); }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <Eye size={14} /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
                  No enquiries matching filters.
                </div>
              )}
            </div>

            {/* Pagination Controls for Enquiries */}
            {activeEnquiryTab === 'farmer' && paginationFarmer.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
                <button
                  disabled={paginationFarmer.page <= 1}
                  onClick={() => handlePageChange('farmer', paginationFarmer.page - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationFarmer.page <= 1 ? 0.5 : 1 }}
                >
                  &larr; Prev
                </button>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Page {paginationFarmer.page} of {paginationFarmer.pages}
                </span>
                <button
                  disabled={paginationFarmer.page >= paginationFarmer.pages}
                  onClick={() => handlePageChange('farmer', paginationFarmer.page + 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationFarmer.page >= paginationFarmer.pages ? 0.5 : 1 }}
                >
                  Next &rarr;
                </button>
              </div>
            )}

            {activeEnquiryTab === 'buyer' && paginationBuyer.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
                <button
                  disabled={paginationBuyer.page <= 1}
                  onClick={() => handlePageChange('buyer', paginationBuyer.page - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationBuyer.page <= 1 ? 0.5 : 1 }}
                >
                  &larr; Prev
                </button>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Page {paginationBuyer.page} of {paginationBuyer.pages}
                </span>
                <button
                  disabled={paginationBuyer.page >= paginationBuyer.pages}
                  onClick={() => handlePageChange('buyer', paginationBuyer.page + 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationBuyer.page >= paginationBuyer.pages ? 0.5 : 1 }}
                >
                  Next &rarr;
                </button>
              </div>
            )}

            {activeEnquiryTab === 'investor' && paginationInvestor.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
                <button
                  disabled={paginationInvestor.page <= 1}
                  onClick={() => handlePageChange('investor', paginationInvestor.page - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationInvestor.page <= 1 ? 0.5 : 1 }}
                >
                  &larr; Prev
                </button>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Page {paginationInvestor.page} of {paginationInvestor.pages}
                </span>
                <button
                  disabled={paginationInvestor.page >= paginationInvestor.pages}
                  onClick={() => handlePageChange('investor', paginationInvestor.page + 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationInvestor.page >= paginationInvestor.pages ? 0.5 : 1 }}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: POPUP LEADS */}
        {activeSection === 'popupLeads' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="admin-controls-bar" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '1rem 1.5rem',
                borderRadius: '8px'
              }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  Popup Callback Leads
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search popup leads..."
                      className="form-input"
                      style={{ padding: '0.45rem 0.75rem 0.45rem 3rem', fontSize: '0.85rem', height: '36px', width: '100%' }}
                    />
                    <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                  <button
                    onClick={() => handleExport('popup-leads')}
                    className="btn btn-primary btn-sm"
                    style={{ height: '36px', padding: '0 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="table-container">
              {popupLeads.length > 0 ? (
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Date Submitted</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popupLeads
                      .filter(l => 
                        !searchQuery.trim() || 
                        l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.phone.includes(searchQuery)
                      )
                      .map(lead => (
                        <tr key={lead._id}>
                          <td><strong>{unescape(lead.name)}</strong></td>
                          <td>{unescape(lead.phone)}</td>
                          <td>{unescape(lead.email)}</td>
                          <td>{formatDate(lead.createdAt || lead.timestamp)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this popup lead?')) {
                                  await deletePopupLead(lead._id);
                                  fetchAnalytics();
                                }
                              }}
                              className="btn btn-dark btn-sm"
                              style={{ backgroundColor: '#dc3545', border: 'none', color: '#fff' }}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
                  No popup leads found.
                </div>
              )}
            </div>

            {/* Pagination Controls for Popup Leads */}
            {paginationPopup.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
                <button
                  disabled={paginationPopup.page <= 1}
                  onClick={() => handlePopupPageChange(paginationPopup.page - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationPopup.page <= 1 ? 0.5 : 1 }}
                >
                  &larr; Prev
                </button>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Page {paginationPopup.page} of {paginationPopup.pages}
                </span>
                <button
                  disabled={paginationPopup.page >= paginationPopup.pages}
                  onClick={() => handlePopupPageChange(paginationPopup.page + 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationPopup.page >= paginationPopup.pages ? 0.5 : 1 }}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: REVIEWS DESK */}
        {activeSection === 'reviews' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0 }}>
                  Testimonial Submissions
                </h2>
                {/* Status Tabs */}
                <div style={{ display: 'inline-flex', marginLeft: '1rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => setReviewFilter('all')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: reviewFilter === 'all' ? 'var(--bg-primary)' : 'transparent',
                      color: reviewFilter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    All ({paginationReviews?.total ?? reviews.length})
                  </button>
                  <button 
                    onClick={() => setReviewFilter('pending')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: reviewFilter === 'pending' ? 'var(--bg-primary)' : 'transparent',
                      color: reviewFilter === 'pending' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    Pending ({reviews.filter(r => r.status === 'pending').length})
                  </button>
                  <button 
                    onClick={() => setReviewFilter('approved')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: reviewFilter === 'approved' ? 'var(--bg-primary)' : 'transparent',
                      color: reviewFilter === 'approved' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    Approved ({reviews.filter(r => r.status === 'approved').length})
                  </button>
                  <button 
                    onClick={() => setReviewFilter('rejected')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: reviewFilter === 'rejected' ? 'var(--bg-primary)' : 'transparent',
                      color: reviewFilter === 'rejected' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    Rejected ({reviews.filter(r => r.status === 'rejected').length})
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reviews..."
                    className="form-input"
                    style={{ padding: '0.45rem 0.75rem 0.45rem 3rem', fontSize: '0.85rem', height: '36px', width: '100%' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
                <button
                  onClick={() => setSortByDateOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="btn btn-secondary btn-sm"
                  style={{ height: '36px', padding: '0 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <ArrowUpDown size={14} /> 
                  Date ({sortByDateOrder === 'desc' ? 'Newest' : 'Oldest'})
                </button>
              </div>
            </div>

            <div className="table-container">
              {processedReviews.length > 0 ? (
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Company</th>
                      <th>Rating</th>
                      <th>Review Text</th>
                      <th>Date Submitted</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedReviews.map(review => {
                      if (!review) return null;
                      const name = unescape(review.customerName);
                      const type = unescape(review.reviewerType);
                      const text = unescape(review.reviewText);
                      const rating = review.rating || 5;
                      const status = review.status || 'pending';
                      
                      return (
                        <tr key={review.id || Math.random().toString()}>
                          <td><strong>{name}</strong></td>
                          <td><span className="badge badge-gold">{type}</span></td>
                          <td>{renderStars(rating)}</td>
                          <td style={{ maxWidth: '300px', fontSize: '0.85rem', lineHeight: '1.4' }}>
                            "{text}"
                          </td>
                          <td><span style={{ fontSize: '0.75rem' }}>{formatDateOnly(review?.createdAt)}</span></td>
                          <td>
                            <span className={`badge ${
                              status === 'approved' ? 'badge-success' : 
                              status === 'rejected' ? 'badge-dark' : 'badge-gold'
                            }`} style={{ 
                              color: 
                                status === 'approved' ? 'green' : 
                                status === 'rejected' ? '#dc3545' : 'inherit' 
                            }}>
                              {status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              {status !== 'approved' && (
                                <button 
                                  title="Approve Review"
                                  onClick={() => handleApproveReview(review?.id)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--success-light)', borderColor: 'var(--success)', color: 'green' }}
                                >
                                  <ThumbsUp size={14} /> Approve
                                </button>
                              )}
                              {status !== 'rejected' && (
                                <button 
                                  title="Reject Review"
                                  onClick={() => handleRejectReview(review?.id)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' }}
                                >
                                  <ThumbsDown size={14} /> Reject
                                </button>
                              )}
                              <button 
                                title="Delete Review"
                                onClick={() => handleDeleteReview(review?.id)}
                                className="btn btn-dark btn-sm"
                                style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', border: 'none', color: '#fff' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
                  No reviews match filters.
                </div>
              )}
            </div>

            {/* Pagination Controls for Reviews */}
            {paginationReviews && paginationReviews.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
                <button
                  disabled={paginationReviews.page <= 1}
                  onClick={() => handleReviewPageChange(paginationReviews.page - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationReviews.page <= 1 ? 0.5 : 1 }}
                >
                  &larr; Prev
                </button>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Page {paginationReviews.page} of {paginationReviews.pages}
                </span>
                <button
                  disabled={paginationReviews.page >= paginationReviews.pages}
                  onClick={() => handleReviewPageChange(paginationReviews.page + 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: paginationReviews.page >= paginationReviews.pages ? 0.5 : 1 }}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <EnquiryDetailsModal 
          selectedEnquiry={selectedEnquiry}
          setSelectedEnquiry={setSelectedEnquiry}
          selectedEnquiryType={selectedEnquiryType}
          markLeadContacted={markLeadContacted}
          deleteLead={deleteLead}
          onPrev={handlePrevEnquiry}
          onNext={handleNextEnquiry}
          hasPrev={hasPrev}
          hasNext={hasNext}
          currentIndex={currentIndex}
          totalCount={processedEnquiries.length}
          fetchAnalytics={fetchAnalytics}
        />
      )}
    </div>
  );
};

const EnquiryDetailsModal = ({ 
  selectedEnquiry, 
  setSelectedEnquiry, 
  selectedEnquiryType, 
  markLeadContacted, 
  deleteLead,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex,
  totalCount,
  fetchAnalytics
}) => {
  if (!selectedEnquiry) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedEnquiry(null)}>
      <div className="modal-container scrollable-modal" style={{ maxWidth: '600px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-sticky">
          <button className="modal-close" onClick={() => setSelectedEnquiry(null)} aria-label="Close details" style={{ top: '1.5rem', right: '1.5rem', zIndex: 12 }}>
            <X size={20} />
          </button>

          <span className="section-tag" style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
            ENQUIRY DETAIL PANEL
          </span>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '2rem' }}>
            <span>{unescape(selectedEnquiry?.name)}</span>
            <span className={`badge ${selectedEnquiry?.contacted ? 'badge-success' : 'badge-gold'}`} style={{ color: selectedEnquiry?.contacted ? 'green' : 'inherit', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
              {selectedEnquiry?.contacted ? 'Contacted' : 'New'}
            </span>
          </h2>
        </div>

        <div className="modal-body-scrollable">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.25rem',
            backgroundColor: 'var(--bg-secondary)', 
            padding: '1.5rem', 
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Phone</label>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{unescape(selectedEnquiry?.phone)}</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Email</label>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{unescape(selectedEnquiry?.email)}</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>State</label>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {unescape(selectedEnquiry?.state || selectedEnquiry?.location)}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>District</label>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{unescape(selectedEnquiry?.district)}</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>City/Village</label>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{unescape(selectedEnquiry?.cityVillage)}</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Product</label>
              <span className="badge badge-gold" style={{ marginTop: '0.25rem', display: 'inline-block' }}>
                {unescape(selectedEnquiry?.productName || selectedEnquiry?.productRequirement || selectedEnquiry?.investmentInterest || selectedEnquiry?.subject || 'General Inquiry')}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Quantity</label>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                {unescape(selectedEnquiry?.quantity || selectedEnquiry?.requiredQuantity)}
              </span>
            </div>

            {selectedEnquiryType === 'buyer' && selectedEnquiry?.packingSize && (
              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Packing Size</label>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {unescape(selectedEnquiry.packingSize)}
                </span>
              </div>
            )}

            {selectedEnquiryType === 'buyer' && selectedEnquiry?.targetBudget && (
              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Estimated Budget</label>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {unescape(selectedEnquiry.targetBudget)} {unescape(selectedEnquiry.currency)}
                </span>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Timestamp</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                <Calendar size={14} />
                <span>{selectedEnquiry?.date ? new Date(selectedEnquiry.date).toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Message</label>
            <div style={{ 
              fontSize: '0.95rem', 
              color: 'var(--text-primary)', 
              lineHeight: '1.6', 
              backgroundColor: 'var(--bg-primary)', 
              padding: '1.25rem', 
              borderRadius: '6px', 
              border: '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap'
            }}>
              {unescape(selectedEnquiry?.message)}
            </div>
          </div>

          {/* Previous / Next Navigation Row */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)' 
          }}>
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="btn btn-secondary btn-sm"
              style={{ opacity: hasPrev ? 1 : 0.5, cursor: hasPrev ? 'pointer' : 'not-allowed' }}
            >
              &larr; Previous
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Enquiry {currentIndex + 1} of {totalCount}
            </span>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className="btn btn-secondary btn-sm"
              style={{ opacity: hasNext ? 1 : 0.5, cursor: hasNext ? 'pointer' : 'not-allowed' }}
            >
              Next &rarr;
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={() => {
                if (selectedEnquiry?.id) {
                  markLeadContacted(selectedEnquiryType, selectedEnquiry.id);
                  setSelectedEnquiry(prev => prev ? { ...prev, contacted: !prev.contacted } : null);
                }
              }} 
              className="btn btn-secondary" 
              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Check size={16} /> {selectedEnquiry?.contacted ? 'Mark as New' : 'Mark Contacted'}
            </button>
            
            <button 
              type="button" 
              onClick={async () => {
                if (selectedEnquiry?.id) {
                  if (confirm('Are you sure you want to delete this enquiry?')) {
                    await deleteLead(selectedEnquiryType, selectedEnquiry.id);
                    setSelectedEnquiry(null);
                    fetchAnalytics();
                  }
                }
              }} 
              className="btn btn-dark" 
              style={{ flex: 1, backgroundColor: '#dc3545', border: 'none', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={16} /> Delete Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
