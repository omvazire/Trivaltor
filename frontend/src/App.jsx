import { Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { FarmerLead } from './pages/FarmerLead';
import { BuyerLead } from './pages/BuyerLead';
import { InvestorLead } from './pages/InvestorLead';
import { CategoryDetail } from './pages/CategoryDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminReports } from './pages/AdminReports';
import { AdminLogin } from './pages/AdminLogin';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default App;
