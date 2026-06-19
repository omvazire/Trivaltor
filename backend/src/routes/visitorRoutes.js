import express from 'express';
import { createVisitor, updateVisitor } from '../controllers/VisitorController.js';
import { validateVisitorCreate, validateVisitorUpdate } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateVisitorCreate, createVisitor);
router.patch('/:sessionId', validateVisitorUpdate, updateVisitor);

export default router;
