import express from 'express';
import { createPopupLead, getAllPopupLeads } from '../controllers/PopupLeadController.js';
import { validatePopupLead } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validatePopupLead, createPopupLead);
router.get('/', getAllPopupLeads);

export default router;
