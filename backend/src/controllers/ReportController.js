import Visitor from '../models/Visitor.js';
import PopupLead from '../models/PopupLead.js';
import Enquiry from '../models/Enquiry.js';
import Review from '../models/Review.js';

// Helper to escape CSV fields
const escapeCSV = (val) => {
  if (val === undefined || val === null) return '';
  let str = String(val);
  str = str.replace(/"/g, '""');
  return `"${str}"`;
};

// Main helper to fetch and calculate monthly report data
export const calculateMonthlyReportData = async (yearNum, monthNum) => {
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0, 0));

  let prevMonth = monthNum - 1;
  let prevYear = yearNum;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = yearNum - 1;
  }

  const prevStartDate = new Date(Date.UTC(prevYear, prevMonth - 1, 1, 0, 0, 0, 0));
  const prevEndDate = new Date(Date.UTC(prevYear, prevMonth, 1, 0, 0, 0, 0));

  const currentQuery = {
    createdAt: {
      $gte: startDate,
      $lt: endDate
    }
  };

  const prevQuery = {
    createdAt: {
      $gte: prevStartDate,
      $lt: prevEndDate
    }
  };

  // 1. Current Month Counts
  const totalVisitors = await Visitor.countDocuments(currentQuery);
  const totalPopupLeads = await PopupLead.countDocuments(currentQuery);
  const totalEnquiries = await Enquiry.countDocuments(currentQuery);
  const totalReviews = await Review.countDocuments(currentQuery);
  const pendingReviews = await Review.countDocuments({ ...currentQuery, status: 'pending' });
  const approvedReviews = await Review.countDocuments({ ...currentQuery, status: 'approved' });

  // 2. Previous Month Counts
  const prevVisitors = await Visitor.countDocuments(prevQuery);
  const prevPopupLeads = await PopupLead.countDocuments(prevQuery);
  const prevEnquiries = await Enquiry.countDocuments(prevQuery);

  // 3. Conversion Rates
  const visitorToPopupConversion = totalVisitors > 0 ? (totalPopupLeads / totalVisitors) * 100 : 0;
  const popupToEnquiryConversion = totalPopupLeads > 0 ? (totalEnquiries / totalPopupLeads) * 100 : 0;
  const visitorToEnquiryConversion = totalVisitors > 0 ? (totalEnquiries / totalVisitors) * 100 : 0;

  // 4. Growth Rates
  let visitorGrowth = 0;
  if (prevVisitors > 0) {
    visitorGrowth = ((totalVisitors - prevVisitors) / prevVisitors) * 100;
  } else if (totalVisitors > 0) {
    visitorGrowth = 100;
  }

  let popupLeadGrowth = 0;
  if (prevPopupLeads > 0) {
    popupLeadGrowth = ((totalPopupLeads - prevPopupLeads) / prevPopupLeads) * 100;
  } else if (totalPopupLeads > 0) {
    popupLeadGrowth = 100;
  }

  let enquiryGrowth = 0;
  if (prevEnquiries > 0) {
    enquiryGrowth = ((totalEnquiries - prevEnquiries) / prevEnquiries) * 100;
  } else if (totalEnquiries > 0) {
    enquiryGrowth = 100;
  }

  // 5. Visitor Insights: Top Categories Ranking & Most Viewed Category
  const categoryRankingResult = await Visitor.aggregate([
    { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
    { $unwind: "$categoryVisited" },
    { $group: { _id: "$categoryVisited.category", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const topCategoriesRanking = categoryRankingResult.map(item => ({
    category: item._id,
    count: item.count
  }));

  const top5Categories = topCategoriesRanking.slice(0, 5);
  const mostViewedCategory = topCategoriesRanking.length > 0 ? topCategoriesRanking[0].category : 'N/A';

  // Language Insights
  const languageStatsResult = await Visitor.aggregate([
    { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: "$languageSelected", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const languageDistribution = languageStatsResult.map(item => ({
    language: item._id || 'en',
    count: item.count
  }));

  const mostSelectedLanguage = languageDistribution.length > 0 ? languageDistribution[0].language : 'N/A';

  // 6. Review Insights: Average Rating
  const avgRatingResult = await Review.aggregate([
    { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } }
  ]);

  const averageRating = avgRatingResult.length > 0 ? parseFloat(avgRatingResult[0].averageRating.toFixed(2)) : 0;

  return {
    metadata: {
      year: yearNum,
      month: monthNum,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      previousMonth: prevMonth,
      previousYear: prevYear
    },
    counts: {
      totalVisitors,
      totalPopupLeads,
      totalEnquiries,
      totalReviews,
      pendingReviews,
      approvedReviews
    },
    previousCounts: {
      visitors: prevVisitors,
      popupLeads: prevPopupLeads,
      enquiries: prevEnquiries
    },
    conversionMetrics: {
      visitorToPopupConversion: parseFloat(visitorToPopupConversion.toFixed(2)),
      popupToEnquiryConversion: parseFloat(popupToEnquiryConversion.toFixed(2)),
      visitorToEnquiryConversion: parseFloat(visitorToEnquiryConversion.toFixed(2))
    },
    growthMetrics: {
      visitorGrowth: parseFloat(visitorGrowth.toFixed(2)),
      popupLeadGrowth: parseFloat(popupLeadGrowth.toFixed(2)),
      enquiryGrowth: parseFloat(enquiryGrowth.toFixed(2))
    },
    visitorInsights: {
      mostViewedCategory,
      topCategoriesRanking: top5Categories,
      mostSelectedLanguage,
      languageDistribution
    },
    reviewInsights: {
      totalReviews,
      pendingReviews,
      approvedReviews,
      averageRating
    }
  };
};

export const getMonthlyReport = async (req, res, next) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year || now.getFullYear(), 10);
    const month = parseInt(req.query.month || (now.getMonth() + 1), 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month or year parameters.'
      });
    }

    const reportData = await calculateMonthlyReportData(year, month);

    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

export const exportMonthlyReport = async (req, res, next) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year || now.getFullYear(), 10);
    const month = parseInt(req.query.month || (now.getMonth() + 1), 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month or year parameters.'
      });
    }

    const report = await calculateMonthlyReportData(year, month);

    const csvLines = [
      `"Monthly Business Performance Report"`,
      `"Report Month",${report.metadata.month}`,
      `"Report Year",${report.metadata.year}`,
      `"Generated At","${new Date().toISOString()}"`,
      ``,
      `"METRIC","VALUE","PREVIOUS MONTH VALUE","GROWTH RATE"`,
      `"Visitors",${report.counts.totalVisitors},${report.previousCounts.visitors},"${report.growthMetrics.visitorGrowth > 0 ? '+' : ''}${report.growthMetrics.visitorGrowth}%"`,
      `"Popup Leads",${report.counts.totalPopupLeads},${report.previousCounts.popupLeads},"${report.growthMetrics.popupLeadGrowth > 0 ? '+' : ''}${report.growthMetrics.popupLeadGrowth}%"`,
      `"Enquiries",${report.counts.totalEnquiries},${report.previousCounts.enquiries},"${report.growthMetrics.enquiryGrowth > 0 ? '+' : ''}${report.growthMetrics.enquiryGrowth}%"`,
      `"Total Reviews",${report.counts.totalReviews},"-","-"`,
      `"Pending Reviews",${report.counts.pendingReviews},"-","-"`,
      `"Approved Reviews",${report.counts.approvedReviews},"-","-"`,
      ``,
      `"CONVERSION FUNNEL METRIC","CONVERSION RATE (%)"`,
      `"Visitor -> Popup Lead","${report.conversionMetrics.visitorToPopupConversion}%"`,
      `"Popup Lead -> Enquiry","${report.conversionMetrics.popupToEnquiryConversion}%"`,
      `"Visitor -> Enquiry","${report.conversionMetrics.visitorToEnquiryConversion}%"`,
      ``,
      `"VISITOR INSIGHTS","VALUE"`,
      `"Most Viewed Category",${escapeCSV(report.visitorInsights.mostViewedCategory)}`,
      `"Most Selected Language",${escapeCSV(report.visitorInsights.mostSelectedLanguage)}`,
      `"Average Review Rating",${report.reviewInsights.averageRating}`,
      ``,
      `"TOP CATEGORIES RANKING","VIEWS COUNT"`,
      ...report.visitorInsights.topCategoriesRanking.map(item => `${escapeCSV(item.category)},${item.count}`),
      ``,
      `"LANGUAGE DISTRIBUTION","VISITORS COUNT"`,
      ...report.visitorInsights.languageDistribution.map(item => `${escapeCSV(item.language)},${item.count}`)
    ];

    const csvContent = csvLines.join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=monthly_business_report_${year}_${month}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
