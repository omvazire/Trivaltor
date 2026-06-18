import express from 'express';
import { 
  createEnquiry, 
  getAllEnquiries, 
  getEnquiryById,
  markEnquiryContacted,
  deleteEnquiry
} from '../controllers/EnquiryController.js';
import { validateEnquiry } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for form submission
router.post('/', validateEnquiry, createEnquiry);

// Protected admin management routes
router.get('/', authMiddleware, getAllEnquiries);
router.get('/:id', authMiddleware, getEnquiryById);
router.patch('/:id/contacted', authMiddleware, markEnquiryContacted);
router.delete('/:id', authMiddleware, deleteEnquiry);

export default router;
