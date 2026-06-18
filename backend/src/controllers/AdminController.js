import Visitor from '../models/Visitor.js';
import PopupLead from '../models/PopupLead.js';
import Enquiry from '../models/Enquiry.js';
import Review from '../models/Review.js';

const escapeCSV = (val) => {
  if (val === undefined || val === null) return '';
  if (val instanceof Date) return `"${val.toISOString()}"`;
  let str = String(val);
  str = str.replace(/"/g, '""');
  return `"${str}"`;
};

export const getAnalytics = async (req, res, next) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const totalPopupLeads = await PopupLead.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();
    const leadConversionCount = await Enquiry.countDocuments({ convertedFromPopupLead: true });
    const pendingReviewsCount = await Review.countDocuments({ approved: false });

    const conversionRate = totalPopupLeads > 0 
      ? (leadConversionCount / totalPopupLeads) * 100 
      : 0;

    // Aggregate category views from Visitor collection
    const categoryViewsResult = await Visitor.aggregate([
      { $unwind: "$categoryVisited" },
      { $group: { _id: "$categoryVisited.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryViews = {};
    categoryViewsResult.forEach(item => {
      if (item._id) {
        categoryViews[item._id] = item.count;
      }
    });

    // Aggregate language statistics
    const languageStatsResult = await Visitor.aggregate([
      { $group: { _id: "$languageSelected", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const languageStats = {};
    languageStatsResult.forEach(item => {
      if (item._id) {
        languageStats[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        totalPopupLeads,
        totalEnquiries,
        leadConversionCount,
        pendingReviewsCount,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        categoryViews,
        languageStats
      }
    });
  } catch (error) {
    next(error);
  }
};

export const exportEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    const headers = [
      'ID', 'Name', 'Phone', 'Email', 'Enquiry Type', 
      'Category', 'State', 'District', 'City/Village', 
      'Pincode', 'Message', 'Contacted', 'Converted From Lead', 'Created At'
    ];

    const rows = enquiries.map(e => [
      e._id,
      e.name,
      e.phone,
      e.email,
      e.enquiryType,
      e.category,
      e.state,
      e.district,
      e.cityVillage,
      e.pincode,
      e.message,
      e.contacted ? 'Yes' : 'No',
      e.convertedFromPopupLead ? 'Yes' : 'No',
      e.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=trivaltor_enquiries.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const exportPopupLeads = async (req, res, next) => {
  try {
    const leads = await PopupLead.find().sort({ createdAt: -1 });
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Created At'];

    const rows = leads.map(l => [
      l._id,
      l.name,
      l.phone,
      l.email,
      l.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=trivaltor_popup_leads.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const exportVisitors = async (req, res, next) => {
  try {
    const visitors = await Visitor.find().sort({ lastVisitTime: -1 });
    const headers = [
      'Session ID', 'First Visit Time', 'Last Visit Time', 
      'Language Selected', 'Pages Visited Count', 'Pages Visited List', 
      'Categories Visited Count', 'Categories Visited List'
    ];

    const rows = visitors.map(v => {
      const pagesList = (v.pagesVisited || []).map(p => p.page).join('; ');
      const categoriesList = (v.categoryVisited || []).map(c => c.category).join('; ');
      return [
        v.sessionId,
        v.firstVisitTime,
        v.lastVisitTime,
        v.languageSelected,
        (v.pagesVisited || []).length,
        pagesList,
        (v.categoryVisited || []).length,
        categoriesList
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=trivaltor_visitors.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
