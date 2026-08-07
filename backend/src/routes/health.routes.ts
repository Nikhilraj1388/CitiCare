import { Router } from 'express';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

router.get('/', (_req, res) => {
  sendSuccess(res, 'CitiCare API is running', {
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

export default router;
