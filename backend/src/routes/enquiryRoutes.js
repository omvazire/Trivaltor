import express from 'express';
import { createEnquiry, getAllEnquiries, getEnquiryById } from '../controllers/EnquiryController.js';
import { validateEnquiry } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateEnquiry, createEnquiry);
router.get('/', getAllEnquiries);
router.get('/:id', getEnquiryById);

export default router;
