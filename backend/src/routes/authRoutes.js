import express from 'express';
import { loginAdmin, getAdminProfile } from '../controllers/AuthController.js';
import { 
  getAnalytics, 
  exportEnquiries, 
  exportPopupLeads, 
  exportVisitors 
} from '../controllers/AdminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', authMiddleware, getAdminProfile);

// Analytics & Exports
router.get('/analytics', authMiddleware, getAnalytics);
router.get('/export/enquiries', authMiddleware, exportEnquiries);
router.get('/export/popup-leads', authMiddleware, exportPopupLeads);
router.get('/export/visitors', authMiddleware, exportVisitors);

export default router;
