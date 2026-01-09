import { Router } from 'express';
import { extractJob, categorizeJob, analyzeResume } from '../controllers/claudeController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/extract-job', extractJob);
router.post('/categorize', categorizeJob);
router.post('/analyze-resume', analyzeResume);

export default router;
