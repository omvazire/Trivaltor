/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

const initialFarmerLeads = [
  {
    id: 'f-1',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    email: 'ramesh.patel@farmemail.com',
    location: 'Gujarat, India',
    productName: 'Organic Cumin Seeds',
    quantity: '1200 Kg',
    message: 'High grade organic cumin seeds harvested last month. Dry and clean.',
    date: '2026-06-02T10:30:00.000Z'
  },
  {
    id: 'f-2',
    name: 'Ananya Sharma',
    phone: '+91 87654 32109',
    email: 'ananya.s@agrihub.org',
    location: 'Kerala, India',
    productName: 'Black Pepper (Malabar Grade)',
    quantity: '800 Kg',
    message: 'Premium sun-dried Malabar black pepper. High piperine content.',
    date: '2026-06-05T14:15:00.000Z'
  },
  {
    id: 'f-3',
    name: 'Sukhwinder Singh',
    phone: '+91 76543 21098',
    email: 'sukhwinder.farm@yahoo.com',
    location: 'Punjab, India',
    productName: 'Turmeric Rhizomes',
    quantity: '2500 Kg',
    message: 'Organic turmeric fingers, rich yellow color. Ready for export.',
    date: '2026-06-08T09:45:00.000Z'
  }
];

const initialBuyerLeads = [
  {
    id: 'b-1',
    name: 'David Miller',
    companyName: 'Apex Spice Importers',
    country: 'United States',
    email: 'dmiller@apexspices.com',
    phone: '+1 (555) 234-5678',
    productRequirement: 'Black Pepper & Cumin (Bulk)',
    message: 'Looking for a monthly supply of 2 tons of Black Pepper and 1 ton of Cumin Seeds. Need samples first.',
    date: '2026-06-01T16:20:00.000Z'
  },
  {
    id: 'b-2',
    name: 'Yuki Tanaka',
    companyName: 'Sakura Foods Ltd',
    country: 'Japan',
    email: 'y.tanaka@sakurafoods.co.jp',
    phone: '+81 3-5555-0143',
    productRequirement: 'Organic Turmeric Powder',
    message: 'Interested in organic turmeric powder with high curcumin levels. Please share price sheet and certifications.',
    date: '2026-06-04T11:05:00.000Z'
  },
  {
    id: 'b-3',
    name: 'Marcus Dubois',
    companyName: 'Euro-Agri Trade',
    country: 'France',
    email: 'm.dubois@euroagri.fr',
    phone: '+33 1 42 68 53 00',
    productRequirement: 'Cardamom & Cloves',
    message: 'Urgent requirement for green Cardamom (8mm size) and handpicked Cloves. Standard European import quality required.',
    date: '2026-06-07T18:30:00.000Z'
  }
];

const initialInvestorLeads = [
  {
    id: 'i-1',
    name: 'Sarah Jenkins',
    phone: '+44 20 7946 0958',
    email: 's.jenkins@vanguardcap.co.uk',
    investmentInterest: 'Agri-Tech Supply Chain & Warehouse Expansion',
    estimatedInvestmentAmount: '$250,000',
    message: 'Interested in strategic expansion. I would like to review the Trivaltor Group presentation PDF and talk to founders about equity opportunities.',
    date: '2026-06-03T08:12:00.000Z'
  },
  {
    id: 'i-2',
    name: 'Rajesh Singhania',
    phone: '+91 99999 88888',
    email: 'rsinghania@singhaniaholdings.com',
    investmentInterest: 'Export-Import Logistics & Cold Storage Infrastructure',
    estimatedInvestmentAmount: '$500,000',
    message: 'Seeking passive yield with asset backing. Interested in warehousing and cold chain logistics scaling plans.',
    date: '2026-06-06T15:50:00.000Z'
  },
  {
    id: 'i-3',
    name: 'Hans Weber',
    phone: '+49 89 2424 8888',
    email: 'h.weber@munich-angels.de',
    investmentInterest: 'Global Spices Marketplace Platform Development',
    estimatedInvestmentAmount: '$100,000',
    message: 'Experienced in tech investments. Interested in the software pipeline connecting farmers directly with buyers.',
    date: '2026-06-09T12:00:00.000Z'
  }
];

const initialContactLeads = [
  {
    id: 'c-1',
    name: 'Amit Verma',
    email: 'amit.verma@outlook.com',
    subject: 'Partnership Query',
    message: 'Do you offer custom packaging with buyer branding for exports?',
    date: '2026-06-09T17:10:00.000Z'
  }
];

export const LeadProvider = ({ children }) => {
  const [farmerLeads, setFarmerLeads] = useState(() => {
    const data = localStorage.getItem('trivaltor-farmer-leads');
    return data ? JSON.parse(data) : initialFarmerLeads;
  });

  const [buyerLeads, setBuyerLeads] = useState(() => {
    const data = localStorage.getItem('trivaltor-buyer-leads');
    return data ? JSON.parse(data) : initialBuyerLeads;
  });

  const [investorLeads, setInvestorLeads] = useState(() => {
    const data = localStorage.getItem('trivaltor-investor-leads');
    return data ? JSON.parse(data) : initialInvestorLeads;
  });

  const [contactLeads, setContactLeads] = useState(() => {
    const data = localStorage.getItem('trivaltor-contact-leads');
    return data ? JSON.parse(data) : initialContactLeads;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('trivaltor-farmer-leads', JSON.stringify(farmerLeads));
  }, [farmerLeads]);

  useEffect(() => {
    localStorage.setItem('trivaltor-buyer-leads', JSON.stringify(buyerLeads));
  }, [buyerLeads]);

  useEffect(() => {
    localStorage.setItem('trivaltor-investor-leads', JSON.stringify(investorLeads));
  }, [investorLeads]);

  useEffect(() => {
    localStorage.setItem('trivaltor-contact-leads', JSON.stringify(contactLeads));
  }, [contactLeads]);

  // Log simulation of backend pipeline
  const simulateBackendPipeline = (leadType, data) => {
    console.group(`%c[Lead Pipeline Simulation] New ${leadType} Inquiry Submitted`, 'color: #c5a880; font-weight: bold; font-size: 11px;');
    console.log('1. Client Validation: SUCCESS');
    console.log('2. Request dispatched via Axios POST: /api/leads/' + leadType.toLowerCase());
    console.log('3. Route Handler parsed payload: ', data);
    console.log('4. MongoDB Mongoose Model instantiated');
    console.log('%c5. Saved to MongoDB Atlas (Production Cluster: trivaltor-db-shard-0)', 'color: #4eaf61; font-weight: bold;');
    console.log('%c6. Dispatched webhook. Google Sheets Backup API triggered.', 'color: #3e8ed7; font-weight: bold;');
    console.log('7. Pipeline status: COMPLETE (201 Created)');
    console.groupEnd();
  };

  const submitFarmerLead = (lead) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLead = {
          id: `f-${Date.now()}`,
          ...lead,
          date: new Date().toISOString()
        };
        setFarmerLeads((prev) => [newLead, ...prev]);
        simulateBackendPipeline('Farmer', newLead);
        setLoading(false);
        resolve({ success: true });
      }, 800);
    });
  };

  const submitBuyerLead = (lead) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLead = {
          id: `b-${Date.now()}`,
          ...lead,
          date: new Date().toISOString()
        };
        setBuyerLeads((prev) => [newLead, ...prev]);
        simulateBackendPipeline('Buyer', newLead);
        setLoading(false);
        resolve({ success: true });
      }, 800);
    });
  };

  const submitInvestorLead = (lead) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLead = {
          id: `i-${Date.now()}`,
          ...lead,
          date: new Date().toISOString()
        };
        setInvestorLeads((prev) => [newLead, ...prev]);
        simulateBackendPipeline('Investor', newLead);
        setLoading(false);
        resolve({ success: true });
      }, 800);
    });
  };

  const submitContactLead = (lead) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLead = {
          id: `c-${Date.now()}`,
          ...lead,
          date: new Date().toISOString()
        };
        setContactLeads((prev) => [newLead, ...prev]);
        simulateBackendPipeline('Contact', newLead);
        setLoading(false);
        resolve({ success: true });
      }, 800);
    });
  };

  return (
    <LeadContext.Provider value={{
      farmerLeads,
      buyerLeads,
      investorLeads,
      contactLeads,
      loading,
      submitFarmerLead,
      submitBuyerLead,
      submitInvestorLead,
      submitContactLead
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
