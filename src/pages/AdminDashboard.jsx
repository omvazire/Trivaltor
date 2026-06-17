import { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { useReviews } from '../context/ReviewContext';
import { 
  Users, Download, LogOut, Lock, 
  Search, ArrowUpDown, Eye, Check, X,
  MessageSquare, Landmark, Calendar, ThumbsUp, ThumbsDown
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    farmerLeads, 
    buyerLeads, 
    investorLeads, 
    deleteLead, 
    markLeadContacted 
  } = useLeads();

  const { 
    reviews, 
    approveReview, 
    rejectReview, 
    deleteReview 
  } = useReviews();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);

  // Main navigation tab: 'enquiries' | 'reviews'
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
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
  };

  // CSV Exporter helper
  const exportToCSV = () => {
    let headers;
    let rows;
    let filename;

    if (activeEnquiryTab === 'farmer') {
      headers = ['ID', 'Name', 'Phone', 'Email', 'Location', 'Product Name', 'Quantity', 'Message', 'Date', 'Contacted'];
      rows = farmerLeads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.phone}"`,
        `"${lead.email}"`,
        `"${lead.location}"`,
        `"${lead.productName}"`,
        `"${lead.quantity}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.date,
        lead.contacted ? 'Yes' : 'No'
      ]);
      filename = 'trivaltor_farmer_leads.csv';
    } else if (activeEnquiryTab === 'buyer') {
      headers = ['ID', 'Name', 'Company Name', 'Country', 'Email', 'Phone', 'Product Requirement', 'Required Quantity', 'Budget', 'Currency', 'State', 'District', 'City/Village', 'Pincode', 'Message', 'Date', 'Contacted'];
      rows = buyerLeads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${(lead.companyName || '').replace(/"/g, '""')}"`,
        `"${lead.country}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.productRequirement}"`,
        `"${(lead.requiredQuantity || '').replace(/"/g, '""')}"`,
        `"${lead.targetBudget || ''}"`,
        `"${lead.currency || 'USD'}"`,
        `"${lead.state || ''}"`,
        `"${lead.district || ''}"`,
        `"${lead.cityVillage || ''}"`,
        `"${lead.pincode || ''}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.date,
        lead.contacted ? 'Yes' : 'No'
      ]);
      filename = 'trivaltor_buyer_leads.csv';
    } else {
      headers = ['ID', 'Name', 'Phone', 'Email', 'Investment Interest', 'Investment Amount', 'Message', 'Date', 'Contacted'];
      rows = investorLeads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.phone}"`,
        `"${lead.email}"`,
        `"${lead.investmentInterest}"`,
        `"${lead.estimatedInvestmentAmount}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.date,
        lead.contacted ? 'Yes' : 'No'
      ]);
      filename = 'trivaltor_investor_leads.csv';
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to filter/sort enquiries
  const getProcessedEnquiries = () => {
    let currentLeads;
    if (activeEnquiryTab === 'farmer') currentLeads = [...farmerLeads];
    else if (activeEnquiryTab === 'buyer') currentLeads = [...buyerLeads];
    else currentLeads = [...investorLeads];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      currentLeads = currentLeads.filter(lead => {
        if (activeEnquiryTab === 'farmer') {
          return lead.name.toLowerCase().includes(q) || 
                 lead.email.toLowerCase().includes(q) || 
                 lead.productName.toLowerCase().includes(q) || 
                 lead.location.toLowerCase().includes(q);
        } else if (activeEnquiryTab === 'buyer') {
          return lead.name.toLowerCase().includes(q) || 
                 lead.email.toLowerCase().includes(q) || 
                 lead.productRequirement.toLowerCase().includes(q) || 
                 (lead.companyName && lead.companyName.toLowerCase().includes(q)) ||
                 lead.country.toLowerCase().includes(q);
        } else {
          return lead.name.toLowerCase().includes(q) || 
                 lead.email.toLowerCase().includes(q) || 
                 lead.investmentInterest.toLowerCase().includes(q);
        }
      });
    }

    // Sort by Date
    currentLeads.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortByDateOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return currentLeads;
  };

  // Helper to filter/sort reviews
  const getProcessedReviews = () => {
    let currentReviews = [...reviews];
    
    // Status Filter
    if (reviewFilter !== 'all') {
      currentReviews = currentReviews.filter(r => r.status === reviewFilter);
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      currentReviews = currentReviews.filter(r => 
        r.customerName.toLowerCase().includes(q) || 
        r.reviewText.toLowerCase().includes(q)
      );
    }

    // Sort by Date
    currentReviews.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortByDateOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return currentReviews;
  };

  const processedEnquiries = getProcessedEnquiries();
  const processedReviews = getProcessedReviews();

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
                Incorrect username or password. Please use standard credentials.
              </p>
            )}

            {/* Demo Helper Banner */}
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
              🔑 <strong>Demo Credentials:</strong><br />
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

        {/* Executive Widgets / Summary */}
        <div className="admin-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card Enquiries */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold-hover)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Enquiries</span>
              <Users size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {farmerLeads.length + buyerLeads.length + investorLeads.length}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Registered leads
            </span>
          </div>

          {/* Card Pending Reviews */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Pending Reviews</span>
              <MessageSquare size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {reviews.filter(r => r.status === 'pending').length}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Requires moderation
            </span>
          </div>

          {/* Card Approved Reviews */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--info)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Public Reviews</span>
              <Landmark size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {reviews.filter(r => r.status === 'approved').length}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Approved testimonials
            </span>
          </div>
        </div>

        {/* Navigation Tabs for Two Main Sections */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
          paddingBottom: '0.5rem'
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
            Review Moderation
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
                <div className="admin-tabs-wrapper" style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-primary)', padding: '0.25rem', borderRadius: '6px' }}>
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
                    Farmers ({farmerLeads.length})
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
                    Buyers ({buyerLeads.length})
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
                    Investors ({investorLeads.length})
                  </button>
                </div>

                {/* Query filters */}
                <div className="admin-actions-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', width: '200px' }}>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search inquiries..."
                      className="form-input"
                      style={{ padding: '0.45rem 0.75rem 0.45rem 2rem', fontSize: '0.85rem', height: '36px' }}
                    />
                    <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                    onClick={exportToCSV}
                    className="btn btn-primary btn-sm"
                    style={{ height: '36px', padding: '0 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Simplified Leads Data Table */}
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
                    {activeEnquiryTab === 'farmer' && processedEnquiries.map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td>Farmer</td>
                        <td><span className="badge badge-gold">{lead.productName}</span></td>
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
                    ))}

                    {activeEnquiryTab === 'buyer' && processedEnquiries.map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td>Buyer</td>
                        <td><span className="badge badge-gold">{lead.productRequirement}</span></td>
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
                    ))}

                    {activeEnquiryTab === 'investor' && processedEnquiries.map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td>Investor</td>
                        <td><span className="badge badge-gold">{selectedEnquiry?.investmentInterest || lead.investmentInterest}</span></td>
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
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
                  No enquiries matching filters.
                </div>
              )}
            </div>
          </div>
          )}

        {/* SECTION 3: REVIEW MODERATION */}
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
                    All ({reviews.length})
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
                <div style={{ position: 'relative', width: '200px' }}>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reviews..."
                    className="form-input"
                    style={{ padding: '0.45rem 0.75rem 0.45rem 2rem', fontSize: '0.85rem', height: '36px' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                      <th>Rating</th>
                      <th>Review Text</th>
                      <th>Date Submitted</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedReviews.map(review => (
                      <tr key={review.id}>
                        <td><strong>{review.customerName}</strong></td>
                        <td>{renderStars(review.rating)}</td>
                        <td style={{ maxWidth: '300px', fontSize: '0.85rem', lineHeight: '1.4' }}>
                          "{review.reviewText}"
                        </td>
                        <td><span style={{ fontSize: '0.75rem' }}>{new Date(review.createdAt).toLocaleDateString()}</span></td>
                        <td>
                          <span className={`badge ${
                            review.status === 'approved' ? 'badge-success' : 
                            review.status === 'rejected' ? 'badge-dark' : 'badge-gold'
                          }`} style={{ 
                            color: 
                              review.status === 'approved' ? 'green' : 
                              review.status === 'rejected' ? '#dc3545' : 'inherit' 
                          }}>
                            {review.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            {review.status !== 'approved' && (
                              <button 
                                title="Approve Review"
                                onClick={() => approveReview(review.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--success-light)', borderColor: 'var(--success)', color: 'green' }}
                              >
                                <ThumbsUp size={14} /> Approve
                              </button>
                            )}
                            {review.status !== 'rejected' && (
                              <button 
                                title="Reject Review"
                                onClick={() => rejectReview(review.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' }}
                              >
                                <ThumbsDown size={14} /> Reject
                              </button>
                            )}
                            <button 
                              title="Delete Review"
                              onClick={() => deleteReview(review.id)}
                              className="btn btn-dark btn-sm"
                              style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', border: 'none', color: '#fff' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
                  No reviews match filters.
                </div>
              )}
            </div>
          </div>
        )}

      </div>



      {/* Simplified Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setSelectedEnquiry(null)}>
          <div className="modal-container" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEnquiry(null)} aria-label="Close details">
              <X size={20} />
            </button>

            <span className="section-tag" style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              ENQUIRY DETAIL PANEL
            </span>
            <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{selectedEnquiry.name}</span>
              <span className={`badge ${selectedEnquiry.contacted ? 'badge-success' : 'badge-gold'}`} style={{ color: selectedEnquiry.contacted ? 'green' : 'inherit', fontSize: '0.85rem' }}>
                {selectedEnquiry.contacted ? 'Contacted' : 'New'}
              </span>
            </h2>

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
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{selectedEnquiry.phone || 'N/A'}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Email</label>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{selectedEnquiry.email}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>State</label>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {selectedEnquiry.state || selectedEnquiry.location || 'N/A'}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>District</label>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{selectedEnquiry.district || 'N/A'}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>City/Village</label>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{selectedEnquiry.cityVillage || 'N/A'}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Product</label>
                <span className="badge badge-gold" style={{ marginTop: '0.25rem', display: 'inline-block' }}>
                  {selectedEnquiry.productName || selectedEnquiry.productRequirement || selectedEnquiry.investmentInterest || selectedEnquiry.subject || 'General Inquiry'}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Quantity</label>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {selectedEnquiry.quantity || selectedEnquiry.requiredQuantity || 'N/A'}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Timestamp</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  <Calendar size={14} />
                  <span>{new Date(selectedEnquiry.date).toLocaleString()}</span>
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
                {selectedEnquiry.message}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={() => {
                  markLeadContacted(selectedEnquiryType, selectedEnquiry.id);
                  setSelectedEnquiry(prev => ({ ...prev, contacted: !prev.contacted }));
                }} 
                className="btn btn-secondary" 
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Check size={16} /> {selectedEnquiry.contacted ? 'Mark as New' : 'Mark Contacted'}
              </button>
              
              <button 
                type="button" 
                onClick={() => {
                  deleteLead(selectedEnquiryType, selectedEnquiry.id);
                  setSelectedEnquiry(null);
                }} 
                className="btn btn-dark" 
                style={{ flex: 1, backgroundColor: '#dc3545', border: 'none', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Trash2 size={16} /> Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
