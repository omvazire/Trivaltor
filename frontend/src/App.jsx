import { Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { FarmerLead } from './pages/FarmerLead';
import { BuyerLead } from './pages/BuyerLead';
import { InvestorLead } from './pages/InvestorLead';
import { CategoryDetail } from './pages/CategoryDetail';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer" element={<FarmerLead />} />
        <Route path="/buyer" element={<BuyerLead />} />
        <Route path="/investor" element={<InvestorLead />} />
        <Route path="/category/:categoryId" element={<CategoryDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Home />} /> {/* Fallback route */}
      </Routes>
    </Layout>
  );
}

export default App;
