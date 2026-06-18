import express from 'express';
import { loginAdmin, getAdminProfile } from '../controllers/AuthController.js';
import { 
  getAnalytics, 
  exportEnquiries, 
  exportPopupLeads, 
  exportVisitors 
} from '../controllers/AdminController.js';
import { getMonthlyReport, exportMonthlyReport } from '../controllers/ReportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', authMiddleware, getAdminProfile);

// Analytics & Exports
router.get('/analytics', authMiddleware, getAnalytics);
router.get('/export/enquiries', authMiddleware, exportEnquiries);
router.get('/export/popup-leads', authMiddleware, exportPopupLeads);
router.get('/export/visitors', authMiddleware, exportVisitors);

// Monthly Business Reports
router.get('/reports/monthly', authMiddleware, getMonthlyReport);
router.get('/reports/monthly/export', authMiddleware, exportMonthlyReport);

export default router;
