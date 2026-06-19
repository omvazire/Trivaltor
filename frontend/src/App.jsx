import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load page components to enable route-based code splitting and optimize initial bundle size
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const FarmerLead = lazy(() => import('./pages/FarmerLead').then(m => ({ default: m.FarmerLead })));
const BuyerLead = lazy(() => import('./pages/BuyerLead').then(m => ({ default: m.BuyerLead })));
const InvestorLead = lazy(() => import('./pages/InvestorLead').then(m => ({ default: m.InvestorLead })));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail').then(m => ({ default: m.CategoryDetail })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminReports = lazy(() => import('./pages/AdminReports').then(m => ({ default: m.AdminReports })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));

// Centered premium loading spinner to show while lazy-loaded chunks are loading
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1rem',
    color: 'var(--text-secondary)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(0, 0, 0, 0.1)',
      borderTop: '3px solid var(--primary-color, #1b4332)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/farmer" element={<FarmerLead />} />
          <Route path="/buyer" element={<BuyerLead />} />
          <Route path="/investor" element={<InvestorLead />} />
          <Route path="/category/:categoryId" element={<CategoryDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Home />} /> {/* Fallback route */}
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
