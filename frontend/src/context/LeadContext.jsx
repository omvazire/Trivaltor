/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const LeadContext = createContext();

const parseEnquiryMessage = (enquiry) => {
  if (!enquiry) return null;
  const { enquiryType, category, message, createdAt, updatedAt, _id, contacted, ...rest } = enquiry;
  
  const parsed = {
    id: _id,
    ...rest,
    category,
    date: createdAt || enquiry.timestamp,
    contacted: contacted || false,
    rawMessage: message
  };

  const msgStr = message || '';

  if (enquiryType === 'farmer') {
    parsed.productName = category || 'N/A';
    const match = msgStr.match(/Quantity:\s*(.*?)\.\s*specs:\s*([\s\S]*)/i);
    if (match) {
      parsed.quantity = match[1];
      parsed.message = match[2];
    } else {
      parsed.quantity = 'N/A';
      parsed.message = msgStr;
    }
  } else if (enquiryType === 'buyer') {
    parsed.productRequirement = category || 'N/A';
    const matchPacking = msgStr.match(/Company:\s*(.*?)\.\s*Country:\s*(.*?)\.\s*Quantity:\s*(.*?)\.\s*Packing Size:\s*(.*?)\.\s*Message:\s*([\s\S]*)/i);
    if (matchPacking) {
      parsed.companyName = matchPacking[1];
      parsed.country = matchPacking[2];
      parsed.requiredQuantity = matchPacking[3];
      parsed.packingSize = matchPacking[4];
      parsed.message = matchPacking[5];
    } else {
      const matchBudget = msgStr.match(/Company:\s*(.*?)\.\s*Country:\s*(.*?)\.\s*Quantity:\s*(.*?)\.\s*Budget:\s*(.*?)\.\s*Message:\s*([\s\S]*)/i);
      if (matchBudget) {
        parsed.companyName = matchBudget[1];
        parsed.country = matchBudget[2];
        parsed.requiredQuantity = matchBudget[3];
        const budgetStr = matchBudget[4];
        const budgetParts = budgetStr.split(' ');
        parsed.targetBudget = budgetParts[0];
        parsed.currency = budgetParts[1] || 'USD';
        parsed.message = matchBudget[5];
      } else {
        parsed.companyName = 'N/A';
        parsed.country = 'N/A';
        parsed.requiredQuantity = 'N/A';
        parsed.packingSize = 'N/A';
        parsed.message = msgStr;
      }
    }
  } else if (enquiryType === 'investor') {
    parsed.investmentInterest = category || 'N/A';
    const match = msgStr.match(/Estimated Investment:\s*(.*?)\.\s*Message:\s*([\s\S]*)/i);
    if (match) {
      const budgetStr = match[1];
      const budgetParts = budgetStr.split(' ');
      parsed.estimatedInvestmentAmount = budgetParts[0];
      parsed.currency = budgetParts[1] || 'USD';
      parsed.message = match[2];
    } else {
      parsed.estimatedInvestmentAmount = 'N/A';
      parsed.currency = 'USD';
      parsed.message = msgStr;
    }
  } else {
    parsed.message = msgStr;
  }

  return parsed;
};

export const LeadProvider = ({ children }) => {
  const [farmerLeads, setFarmerLeads] = useState([]);
  const [buyerLeads, setBuyerLeads] = useState([]);
  const [investorLeads, setInvestorLeads] = useState([]);
  const [contactLeads, setContactLeads] = useState([]);
  const [popupLeads, setPopupLeads] = useState([]);

  const [paginationFarmer, setPaginationFarmer] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [paginationBuyer, setPaginationBuyer] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [paginationInvestor, setPaginationInvestor] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [paginationContact, setPaginationContact] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [paginationPopup, setPaginationPopup] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  const [loading, setLoading] = useState(false);

  const fetchEnquiries = async (type, page = 1, limit = 20) => {
    setLoading(true);
    try {
      const res = await api.enquiry.getAll({ enquiryType: type, page, limit });
      if (res.success && Array.isArray(res.data)) {
        const parsed = res.data.map(parseEnquiryMessage);
        if (type === 'farmer') {
          setFarmerLeads(parsed);
          setPaginationFarmer(res.pagination || { page, limit, total: parsed.length, pages: 1 });
        } else if (type === 'buyer') {
          setBuyerLeads(parsed);
          setPaginationBuyer(res.pagination || { page, limit, total: parsed.length, pages: 1 });
        } else if (type === 'investor') {
          setInvestorLeads(parsed);
          setPaginationInvestor(res.pagination || { page, limit, total: parsed.length, pages: 1 });
        } else if (type === 'contact') {
          setContactLeads(parsed);
          setPaginationContact(res.pagination || { page, limit, total: parsed.length, pages: 1 });
        }
      }
    } catch (err) {
      console.error(`[LeadContext] Failed to fetch ${type} enquiries:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopupLeads = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const res = await api.popupLead.getAll({ page, limit });
      if (res.success && Array.isArray(res.data)) {
        setPopupLeads(res.data);
        setPaginationPopup(res.pagination || { page, limit, total: res.data.length, pages: 1 });
      }
    } catch (err) {
      console.error('[LeadContext] Failed to fetch popup leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitPopupLead = async (lead) => {
    try {
      await api.popupLead.create({
        name: lead.name,
        phone: lead.phone,
        email: lead.email
      });
      return { success: true };
    } catch (err) {
      console.error('[Popup Lead Submission Error]', err);
      return { success: false, error: err.message || 'Validation or Server Error' };
    }
  };

  const submitFarmerLead = async (lead) => {
    setLoading(true);
    try {
      await api.enquiry.create({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        enquiryType: 'farmer',
        category: lead.productName || 'N/A',
        state: lead.state,
        district: lead.district,
        cityVillage: lead.cityVillage || 'N/A',
        pincode: lead.pincode,
        message: `Quantity: ${lead.quantity || 'N/A'}. specs: ${lead.message || ''}`
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('[Farmer Enquiry Submission Error]', err);
      setLoading(false);
      return { success: false, error: err.message || 'Validation or Server Error' };
    }
  };

  const submitBuyerLead = async (lead) => {
    setLoading(true);
    try {
      await api.enquiry.create({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        enquiryType: 'buyer',
        category: lead.productRequirement || 'N/A',
        state: lead.state,
        district: lead.district,
        cityVillage: lead.cityVillage || 'N/A',
        pincode: lead.pincode,
        message: `Company: ${lead.companyName || 'N/A'}. Country: ${lead.country || 'N/A'}. Quantity: ${lead.requiredQuantity || 'N/A'}. Packing Size: ${lead.packingSize || 'N/A'}. Message: ${lead.message || ''}`
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('[Buyer Enquiry Submission Error]', err);
      setLoading(false);
      return { success: false, error: err.message || 'Validation or Server Error' };
    }
  };

  const submitInvestorLead = async (lead) => {
    setLoading(true);
    try {
      await api.enquiry.create({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        enquiryType: 'investor',
        category: lead.investmentInterest || 'N/A',
        state: lead.state,
        district: lead.district,
        cityVillage: lead.cityVillage || 'N/A',
        pincode: lead.pincode,
        message: `Estimated Investment: ${lead.estimatedInvestmentAmount || 'N/A'} ${lead.currency || 'USD'}. Message: ${lead.message || ''}`
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('[Investor Enquiry Submission Error]', err);
      setLoading(false);
      return { success: false, error: err.message || 'Validation or Server Error' };
    }
  };

  const submitContactLead = async (lead) => {
    setLoading(true);
    try {
      await api.enquiry.create({
        name: lead.name,
        phone: 'N/A',
        email: lead.email,
        enquiryType: 'contact',
        category: 'General Contact',
        state: 'N/A',
        district: 'N/A',
        cityVillage: 'N/A',
        pincode: 'N/A',
        message: lead.message || ''
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('[Contact Enquiry Submission Error]', err);
      setLoading(false);
      return { success: false, error: err.message || 'Validation or Server Error' };
    }
  };

  const deleteLead = async (leadType, id) => {
    try {
      await api.enquiry.delete(id);
      if (leadType === 'farmer') {
        setFarmerLeads(prev => prev.filter(l => l.id !== id));
        fetchEnquiries('farmer', paginationFarmer.page, paginationFarmer.limit);
      } else if (leadType === 'buyer') {
        setBuyerLeads(prev => prev.filter(l => l.id !== id));
        fetchEnquiries('buyer', paginationBuyer.page, paginationBuyer.limit);
      } else if (leadType === 'investor') {
        setInvestorLeads(prev => prev.filter(l => l.id !== id));
        fetchEnquiries('investor', paginationInvestor.page, paginationInvestor.limit);
      } else if (leadType === 'contact') {
        setContactLeads(prev => prev.filter(l => l.id !== id));
        fetchEnquiries('contact', paginationContact.page, paginationContact.limit);
      }
    } catch (err) {
      console.error('[LeadContext] Failed to delete lead:', err);
      alert(err.message || 'Failed to delete lead');
    }
  };

  const markLeadContacted = async (leadType, id) => {
    try {
      const res = await api.enquiry.markContacted(id);
      if (res.success) {
        const toggleContacted = (leads) => 
          leads.map(lead => lead.id === id ? { ...lead, contacted: res.data.contacted } : lead);
        if (leadType === 'farmer') {
          setFarmerLeads(prev => toggleContacted(prev));
        } else if (leadType === 'buyer') {
          setBuyerLeads(prev => toggleContacted(prev));
        } else if (leadType === 'investor') {
          setInvestorLeads(prev => toggleContacted(prev));
        } else if (leadType === 'contact') {
          setContactLeads(prev => toggleContacted(prev));
        }
      }
    } catch (err) {
      console.error('[LeadContext] Failed to update contacted status:', err);
      alert(err.message || 'Failed to update contacted status');
    }
  };

  const deletePopupLead = async (id) => {
    try {
      await api.popupLead.delete(id);
      setPopupLeads(prev => prev.filter(l => l._id !== id));
      fetchPopupLeads(paginationPopup.page, paginationPopup.limit);
    } catch (err) {
      console.error('[LeadContext] Failed to delete popup lead:', err);
      alert(err.message || 'Failed to delete popup lead');
    }
  };

  return (
    <LeadContext.Provider value={{
      farmerLeads,
      buyerLeads,
      investorLeads,
      contactLeads,
      popupLeads,
      paginationFarmer,
      paginationBuyer,
      paginationInvestor,
      paginationContact,
      paginationPopup,
      loading,
      fetchEnquiries,
      fetchPopupLeads,
      submitPopupLead,
      submitFarmerLead,
      submitBuyerLead,
      submitInvestorLead,
      submitContactLead,
      deleteLead,
      markLeadContacted,
      deletePopupLead
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
