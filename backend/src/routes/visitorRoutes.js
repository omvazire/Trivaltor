import express from 'express';
import { createVisitor, updateVisitor } from '../controllers/VisitorController.js';

const router = express.Router();

router.post('/', createVisitor);
router.patch('/:sessionId', updateVisitor);

export default router;
