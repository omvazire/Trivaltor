import { Database, FileSpreadsheet, Server, UserCheck, ArrowRight, ArrowDown } from 'lucide-react';

export const LeadArchitectureAlert = () => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius-md)',
      padding: '2rem',
      boxShadow: 'var(--shadow-sm)',
      marginTop: '2rem'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        marginBottom: '1rem',
        fontFamily: 'var(--font-heading)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Server size={22} style={{ color: 'var(--accent-gold)' }} />
        MERN + Google Sheets Lead Architecture Pipeline
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        marginBottom: '2rem',
        lineHeight: '1.5'
      }}>
        For the production release, the forms are wired to a RESTful Node.js (Express) backend. Submissions are stored instantly in MongoDB Atlas and mirrored in real-time to Google Sheets for business ops convenience.
      </p>

      {/* Visual Pipeline */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        {/* Desktop Pipeline Layout */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Step 1: Frontend */}
          <div style={{
            flex: '1',
            minWidth: '180px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            padding: '1.25rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <UserCheck size={28} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>React Frontend</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Form validation & Axios POST</span>
          </div>

          <ArrowRight className="pipeline-arrow-rt" size={24} style={{ color: 'var(--border-color)' }} />
          <ArrowDown className="pipeline-arrow-dn" size={24} style={{ color: 'var(--border-color)' }} />

          {/* Step 2: Express Server */}
          <div style={{
            flex: '1',
            minWidth: '180px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            padding: '1.25rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <Server size={28} style={{ color: 'var(--info)', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>Node.js / Express</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure API Route Handlers</span>
          </div>

          <ArrowRight className="pipeline-arrow-rt" size={24} style={{ color: 'var(--border-color)' }} />
          <ArrowDown className="pipeline-arrow-dn" size={24} style={{ color: 'var(--border-color)' }} />

          {/* Step 3: Split targets */}
          <div style={{
            flex: '1.5',
            minWidth: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* MongoDB Atlas */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'var(--success-light)',
              border: '1px solid rgba(78, 175, 97, 0.2)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--success)'
            }}>
              <Database size={20} />
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ fontSize: '0.85rem', margin: '0', fontFamily: 'var(--font-heading)', fontWeight: '600' }}>MongoDB Atlas</h5>
                <span style={{ fontSize: '0.7rem', opacity: '0.8' }}>Document Store (Primary)</span>
              </div>
            </div>

            {/* Google Sheets */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'var(--info-light)',
              border: '1px solid rgba(62, 142, 215, 0.2)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--info)'
            }}>
              <FileSpreadsheet size={20} />
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ fontSize: '0.85rem', margin: '0', fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Google Sheets API</h5>
                <span style={{ fontSize: '0.7rem', opacity: '0.8' }}>Live Backup spreadsheet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console Note */}
        <div style={{
          fontSize: '0.75rem',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          padding: '0.75rem 1.25rem',
          borderRadius: '6px',
          width: '100%',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          fontFamily: 'monospace'
        }}>
          💡 Note: Currently running in Demo Mode. Open the browser Developer Console (F12) during form submission to view simulated API payloads, MongoDB models, and Google Sheets trigger logs.
        </div>
      </div>
    </div>
  );
};
