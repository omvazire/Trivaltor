import express from 'express';
import { createPopupLead, getAllPopupLeads, deletePopupLead } from '../controllers/PopupLeadController.js';
import { validatePopupLead } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for popup lead creation
router.post('/', validatePopupLead, createPopupLead);

// Protected routes for admin management
router.get('/', authMiddleware, getAllPopupLeads);
router.delete('/:id', authMiddleware, deletePopupLead);

export default router;
