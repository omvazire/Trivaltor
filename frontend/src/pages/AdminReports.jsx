import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Calendar,
  Users,
  Download,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft
} from 'lucide-react';

export const AdminReports = () => {
  const navigate = useNavigate();

  // Date state defaults to current month and year
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const monthsList = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Year list from 2024 to 2028
  const yearsList = [2024, 2025, 2026, 2027, 2028];

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.getMonthlyReport({ month, year });
      if (res.success) {
        setReport(res.data);
      } else {
        setError(res.message || 'Failed to fetch report data.');
      }
    } catch (err) {
      console.error('[AdminReports] Error fetching report:', err);
      setError(err.message || 'An error occurred while loading the report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const blobData = await api.admin.exportMonthlyReport({ month, year });
      const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `monthly_business_report_${year}_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[AdminReports] CSV Export failed:', err);
      alert('CSV Export failed: ' + (err.message || err));
    } finally {
      setExportLoading(false);
    }
  };

  const renderGrowthTag = (val) => {
    if (val === undefined || val === null) return null;
    const isPositive = val > 0;
    const isNegative = val < 0;

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: isPositive ? '#10b981' : isNegative ? '#ef4444' : 'var(--text-muted)',
          backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : isNegative ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          marginLeft: '0.5rem'
        }}
      >
        {isPositive ? <ArrowUpRight size={12} /> : isNegative ? <ArrowDownRight size={12} /> : null}
        {isPositive ? '+' : ''}
        {val}% MoM
      </span>
    );
  };

  const renderStars = (rating) => {
    const r = Math.round(rating || 0);
    return (
      <div style={{ display: 'inline-flex', gap: '0.1rem', color: '#e0a96d', fontSize: '1.1rem' }}>
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < r ? '★' : '☆'}</span>
        ))}
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.4rem', alignSelf: 'center' }}>
          ({rating.toFixed(2)})
        </span>
      </div>
    );
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '90vh', padding: '4rem 0' }}>
      <div className="container">
        
        {/* Back Link to Dashboard */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--accent-gold-hover)', 
              fontSize: '0.9rem', 
              fontWeight: '600' 
            }}
          >
            <ArrowLeft size={16} /> Back to Trade Desk
          </button>
        </div>

        {/* Header Block */}
        <div style={{
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
            <span className="section-tag" style={{ margin: '0' }}>Secret Executive Report</span>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Monthly Business Analytics
            </h1>
          </div>

          {/* Date Selector & Export Controls */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="form-select"
                style={{ width: '140px', height: '40px', padding: '0 0.75rem', fontSize: '0.9rem' }}
              >
                {monthsList.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="form-select"
                style={{ width: '100px', height: '40px', padding: '0 0.75rem', fontSize: '0.9rem' }}
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={exportLoading || loading || error}
              className="btn btn-primary"
              style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={16} />
              {exportLoading ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '40vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--accent-gold)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Compiling monthly aggregates and insights...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            color: '#ef4444',
            margin: '2rem 0'
          }}>
            <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Failed to Load Reporting Data</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{error}</p>
            <button onClick={fetchReport} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem', color: '#ef4444', borderColor: '#ef4444' }}>
              Retry Fetching
            </button>
          </div>
        ) : report ? (
          <div>
            
            {/* 1. OVERVIEW CARDS */}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              1. Month Performance Totals
            </h3>
            <div className="admin-stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              {/* Visitors Card */}
              <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Monthly Visitors</span>
                  <Users size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.5rem' }}>
                  <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>
                    {report.counts.totalVisitors}
                  </h2>
                  {renderGrowthTag(report.growthMetrics.visitorGrowth)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Previous: {report.previousCounts.visitors} sessions
                </span>
              </div>

              {/* Popup Leads Card */}
              <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--info)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Popup Leads</span>
                  <MessageSquare size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.5rem' }}>
                  <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>
                    {report.counts.totalPopupLeads}
                  </h2>
                  {renderGrowthTag(report.growthMetrics.popupLeadGrowth)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Previous: {report.previousCounts.popupLeads} submissions
                </span>
              </div>

              {/* Enquiries Card */}
              <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold-hover)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Desk Enquiries</span>
                  <Award size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.5rem' }}>
                  <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>
                    {report.counts.totalEnquiries}
                  </h2>
                  {renderGrowthTag(report.growthMetrics.enquiryGrowth)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Previous: {report.previousCounts.enquiries} inquiries
                </span>
              </div>

              {/* Reviews Overview Card */}
              <div className="premium-card" style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10b981' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Reviews Submitted</span>
                  <Star size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '0.5rem' }}>
                  <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>
                    {report.reviewInsights.totalReviews}
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    ★ Avg: {report.reviewInsights.averageRating.toFixed(1)}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Approved: {report.reviewInsights.approvedReviews} | Pending: {report.reviewInsights.pendingReviews}
                </span>
              </div>
            </div>

            {/* 2. CONVERSION FUNNEL & GROWTH SUMMARY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }} className="form-grid">
              
              {/* Funnel Card */}
              <div className="premium-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
                  <TrendingUp size={20} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>2. Conversion Funnel</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Visitor -> Popup */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Visitor &rarr; Popup Lead Conversion</span>
                      <span style={{ color: 'var(--text-primary)' }}>{report.conversionMetrics.visitorToPopupConversion}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(report.conversionMetrics.visitorToPopupConversion, 100)}%`, height: '100%', backgroundColor: 'var(--info)', borderRadius: '4px' }}></div>
                    </div>
                  </div>

                  {/* Popup -> Enquiry */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Popup Lead &rarr; Desk Enquiry Conversion</span>
                      <span style={{ color: 'var(--text-primary)' }}>{report.conversionMetrics.popupToEnquiryConversion}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(report.conversionMetrics.popupToEnquiryConversion, 100)}%`, height: '100%', backgroundColor: 'var(--accent-gold)', borderRadius: '4px' }}></div>
                    </div>
                  </div>

                  {/* Visitor -> Enquiry */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Visitor &rarr; Desk Enquiry (Overall Funnel)</span>
                      <span style={{ color: 'var(--text-primary)' }}>{report.conversionMetrics.visitorToEnquiryConversion}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(report.conversionMetrics.visitorToEnquiryConversion, 100)}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Reviews Detail Card */}
              <div className="premium-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#e0a96d' }}>
                  <Star size={20} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>3. Reviews Moderation & Satisfaction</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', height: '100%' }}>
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.1' }}>
                      {report.reviewInsights.averageRating.toFixed(2)}
                    </div>
                    <div style={{ margin: '0.25rem 0 0.5rem 0' }}>
                      {renderStars(report.reviewInsights.averageRating)}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average rating based on this month's reviews</p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{report.reviewInsights.approvedReviews}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-gold-hover)' }}>{report.reviewInsights.pendingReviews}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{report.reviewInsights.totalReviews}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. VISITOR INSIGHTS TABLES */}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              4. Deep Visitor Insights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '2rem' }} className="form-grid">
              
              {/* Category Views Rank */}
              <div className="premium-card" style={{ padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
                    <Award size={18} />
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>Top Categories Ranking</h4>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Most Viewed: <strong style={{ color: 'var(--accent-gold-hover)' }}>{report.visitorInsights.mostViewedCategory}</strong>
                  </span>
                </div>

                <div className="table-container" style={{ border: 'none', boxShadow: 'none', margin: 0 }}>
                  {report.visitorInsights.topCategoriesRanking.length > 0 ? (
                    <table className="leads-table">
                      <thead>
                        <tr>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}>Rank</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}>Category Name</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', textAlign: 'right' }}>Total Hits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.visitorInsights.topCategoriesRanking.map((item, index) => (
                          <tr key={item.category || index}>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: 'var(--accent-gold-hover)' }}>#{index + 1}</td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}>{item.category}</span>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600' }}>{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No category tracking documents compiled for this range.
                    </div>
                  )}
                </div>
              </div>

              {/* Language Distribution */}
              <div className="premium-card" style={{ padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--info)' }}>
                    <Globe size={18} />
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>Language Distribution</h4>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Top Lang: <strong style={{ color: 'var(--info)' }}>{report.visitorInsights.mostSelectedLanguage.toUpperCase()}</strong>
                  </span>
                </div>

                <div className="table-container" style={{ border: 'none', boxShadow: 'none', margin: 0 }}>
                  {report.visitorInsights.languageDistribution.length > 0 ? (
                    <table className="leads-table">
                      <thead>
                        <tr>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}>Language</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', textAlign: 'right' }}>Sessions</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', textAlign: 'right' }}>Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.visitorInsights.languageDistribution.map((item, index) => {
                          const percentage = report.counts.totalVisitors > 0 
                            ? ((item.count / report.counts.totalVisitors) * 100).toFixed(1) 
                            : '0.0';
                          return (
                            <tr key={item.language || index}>
                              <td style={{ padding: '0.75rem 1rem', fontWeight: '600', textTransform: 'uppercase' }}>{item.language}</td>
                              <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{item.count}</td>
                              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-primary)' }}>{percentage}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No language preferences parsed.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            No report data could be generated for the selected month and year.
          </div>
        )}

      </div>
    </div>
  );
};
