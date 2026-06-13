import { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { 
  Users, Sprout, Ship, Landmark, Download, LogOut, Lock, 
  Search, ArrowUpDown, TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip as ChartTooltip, Legend 
} from 'recharts';

// Mock Reporting Chart Data
const monthlyGrowthData = [
  { month: 'Jan', FarmerLeads: 2, BuyerLeads: 1, InvestorLeads: 1 },
  { month: 'Feb', FarmerLeads: 5, BuyerLeads: 3, InvestorLeads: 2 },
  { month: 'Mar', FarmerLeads: 8, BuyerLeads: 5, InvestorLeads: 3 },
  { month: 'Apr', FarmerLeads: 12, BuyerLeads: 8, InvestorLeads: 4 },
  { month: 'May', FarmerLeads: 18, BuyerLeads: 12, InvestorLeads: 7 },
  { month: 'Jun', FarmerLeads: 26, BuyerLeads: 18, InvestorLeads: 11 }
];

export const AdminDashboard = () => {
  const { farmerLeads, buyerLeads, investorLeads } = useLeads();
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);

  // Tab State: 'farmer' | 'buyer' | 'investor'
  const [activeTab, setActiveTab] = useState('farmer');

  // Search & Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByDateOrder, setSortByDateOrder] = useState('desc'); // 'asc' | 'desc'

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

    if (activeTab === 'farmer') {
      headers = ['ID', 'Name', 'Phone', 'Email', 'Location', 'Product Name', 'Quantity', 'Message', 'Date'];
      rows = farmerLeads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.phone}"`,
        `"${lead.email}"`,
        `"${lead.location}"`,
        `"${lead.productName}"`,
        `"${lead.quantity}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.date
      ]);
      filename = 'trivaltor_farmer_leads.csv';
    } else if (activeTab === 'buyer') {
      headers = ['ID', 'Name', 'Company Name', 'Country', 'Email', 'Phone', 'Product Requirement', 'Required Quantity', 'Message', 'Date'];
      rows = buyerLeads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.companyName.replace(/"/g, '""')}"`,
        `"${lead.country}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.productRequirement}"`,
        `"${(lead.requiredQuantity || '').replace(/"/g, '""')}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.date
      ]);
      filename = 'trivaltor_buyer_leads.csv';
    } else {
      headers = ['ID', 'Name', 'Phone', 'Email', 'Investment Interest', 'Investment Amount', 'Message', 'Date'];
      rows = investorLeads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.phone}"`,
        `"${lead.email}"`,
        `"${lead.investmentInterest}"`,
        `"${lead.estimatedInvestmentAmount}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.date
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

  // Helper to filter/sort leads
  const getProcessedLeads = () => {
    let currentLeads;
    if (activeTab === 'farmer') currentLeads = [...farmerLeads];
    else if (activeTab === 'buyer') currentLeads = [...buyerLeads];
    else currentLeads = [...investorLeads];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      currentLeads = currentLeads.filter(lead => {
        if (activeTab === 'farmer') {
          return lead.name.toLowerCase().includes(q) || 
                 lead.email.toLowerCase().includes(q) || 
                 lead.productName.toLowerCase().includes(q) || 
                 lead.location.toLowerCase().includes(q);
        } else if (activeTab === 'buyer') {
          return lead.name.toLowerCase().includes(q) || 
                 lead.email.toLowerCase().includes(q) || 
                 lead.productRequirement.toLowerCase().includes(q) || 
                 lead.companyName.toLowerCase().includes(q) ||
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

  const processedLeads = getProcessedLeads();

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
                Incorrect username or password. Please use standard demo credentials.
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

  // Dashboard View
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

        {/* 12. Reporting System (Widgets & Chart) */}
        <div className="admin-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card Total */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold-hover)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Inquiries</span>
              <Users size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {farmerLeads.length + buyerLeads.length + investorLeads.length}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <TrendingUp size={12} style={{ color: 'var(--success)' }} />
              +22% growth this month
            </span>
          </div>

          {/* Card Farmers */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--success)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Farmer Leads</span>
              <Sprout size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {farmerLeads.length}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered cultivators</span>
          </div>

          {/* Card Buyers */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--info)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Buyer Leads</span>
              <Ship size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {buyerLeads.length}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Global food importers</span>
          </div>

          {/* Card Investors */}
          <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold-hover)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Investor Leads</span>
              <Landmark size={20} />
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {investorLeads.length}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Strategic asset partners</span>
          </div>
        </div>

        {/* Growth Chart */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '3rem'
        }}>
          <h3 style={{
            fontSize: '1.15rem',
            fontFamily: 'var(--font-heading)',
            marginBottom: '1.5rem',
            color: 'var(--text-primary)'
          }}>
            Leads Performance & Monthly Growth
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <ChartTooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="FarmerLeads" name="Farmer Inquiries" stroke="#4eaf61" strokeWidth={2.5} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="BuyerLeads" name="Buyer Orders" stroke="#3e8ed7" strokeWidth={2.5} />
                <Line type="monotone" dataKey="InvestorLeads" name="Investments" stroke="#c5a880" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads Table Management */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Inquiry Records Log
          </h2>

          {/* Controls Bar */}
          <div className="admin-controls-bar" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            padding: '1rem 1.5rem',
            borderRadius: '8px'
          }}>
            {/* Tabs */}
            <div className="admin-tabs-wrapper" style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-primary)', padding: '0.25rem', borderRadius: '6px' }}>
              <button 
                onClick={() => { setActiveTab('farmer'); setSearchQuery(''); }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'farmer' ? 'var(--bg-secondary)' : 'transparent',
                  color: activeTab === 'farmer' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'farmer' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Farmers ({farmerLeads.length})
              </button>
              <button 
                onClick={() => { setActiveTab('buyer'); setSearchQuery(''); }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'buyer' ? 'var(--bg-secondary)' : 'transparent',
                  color: activeTab === 'buyer' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'buyer' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Buyers ({buyerLeads.length})
              </button>
              <button 
                onClick={() => { setActiveTab('investor'); setSearchQuery(''); }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'investor' ? 'var(--bg-secondary)' : 'transparent',
                  color: activeTab === 'investor' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'investor' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Investors ({investorLeads.length})
              </button>
            </div>

            {/* Search, Sort, Export Actions */}
            <div className="admin-actions-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              
              {/* Search */}
              <div style={{ position: 'relative', width: '220px' }}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search table..."
                  className="form-input"
                  style={{ padding: '0.45rem 0.75rem 0.45rem 2rem', fontSize: '0.85rem', height: '36px' }}
                />
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>

              {/* Sort Date */}
              <button
                onClick={() => setSortByDateOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="btn btn-secondary btn-sm"
                style={{ height: '36px', padding: '0 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                title="Sort by Submission Date"
              >
                <ArrowUpDown size={14} /> 
                Date ({sortByDateOrder === 'desc' ? 'Newest' : 'Oldest'})
              </button>

              {/* CSV Export */}
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

        {/* Data Table */}
        <div className="table-container">
          {processedLeads.length > 0 ? (
            <table className="leads-table">
              {activeTab === 'farmer' && (
                <>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedLeads.map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td><span style={{ whiteSpace: 'nowrap' }}>{lead.phone}</span></td>
                        <td>{lead.email}</td>
                        <td>{lead.location}</td>
                        <td><span className="badge badge-gold">{lead.productName}</span></td>
                        <td><strong>{lead.quantity}</strong></td>
                        <td style={{ maxWidth: '240px', fontSize: '0.8rem' }}>{lead.message}</td>
                        <td><span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(lead.date).toLocaleDateString()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {activeTab === 'buyer' && (
                <>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Country</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Product Requirement</th>
                      <th>Qty Required</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedLeads.map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td>{lead.companyName}</td>
                        <td><strong>{lead.country}</strong></td>
                        <td><span style={{ whiteSpace: 'nowrap' }}>{lead.phone}</span></td>
                        <td>{lead.email}</td>
                        <td><span className="badge badge-gold">{lead.productRequirement}</span></td>
                        <td><strong>{lead.requiredQuantity || 'N/A'}</strong></td>
                        <td style={{ maxWidth: '240px', fontSize: '0.8rem' }}>{lead.message}</td>
                        <td><span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(lead.date).toLocaleDateString()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {activeTab === 'investor' && (
                <>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Interest Area</th>
                      <th>Amount</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedLeads.map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td><span style={{ whiteSpace: 'nowrap' }}>{lead.phone}</span></td>
                        <td>{lead.email}</td>
                        <td style={{ maxWidth: '180px' }}>{lead.investmentInterest}</td>
                        <td><span style={{ color: 'var(--accent-gold-hover)', fontWeight: '700' }}>{lead.estimatedInvestmentAmount}</span></td>
                        <td style={{ maxWidth: '240px', fontSize: '0.8rem' }}>{lead.message}</td>
                        <td><span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(lead.date).toLocaleDateString()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
              No leads match the query filter/search.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
