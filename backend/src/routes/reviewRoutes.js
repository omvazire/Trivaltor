import express from 'express';
import { 
  createReview, 
  getApprovedReviews, 
  getReviews, 
  approveReview, 
  rejectReview, 
  deleteReview 
} from '../controllers/ReviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public review endpoints
router.post('/', createReview);
router.get('/approved', getApprovedReviews);

// Protected admin review desk endpoints
router.get('/', authMiddleware, getReviews);
router.patch('/:id/approve', authMiddleware, approveReview);
router.patch('/:id/reject', authMiddleware, rejectReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
