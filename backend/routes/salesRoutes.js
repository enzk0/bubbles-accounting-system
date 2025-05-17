import express from 'express';
import { modifyJobOrder } from '../controllers/jobOrderModificationController.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.use((req, res, next) => {
  const role = req.headers['role'];
  if (!role) return res.status(401).json({ error: 'Missing role in headers' });
  req.user = { id: 1, role };
  next();
});

router.patch('/employee/job-orders/:id', checkRole(['employee']), modifyJobOrder);

router.patch('/admin/job-orders/:id', checkRole(['admin']), modifyJobOrder);

export default router;
