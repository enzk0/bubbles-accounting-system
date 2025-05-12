import express from 'express';
import { modifyJobOrder as employeeModify } from '../controllers/employeeController.js';
import { modifyJobOrder as adminModify } from '../controllers/adminController.js';
import checkRole from '../auth/checkRole.js';

const router = express.Router();


router.use((req, res, next) => {
  const role = req.headers['role'];
  
  if (!role) {
    return res.status(401).json({ error: 'Missing role in headers' });
  }

  req.user = { id: 1, role }; 
  next();
});

// Employee-only route
router.patch(
  '/employee/job-orders/:id',
  checkRole('employee'),
  employeeModify
);

// Admin-only route
router.patch(
  '/admin/job-orders/:id',
  checkRole('admin'),
  adminModify
);

export default router;
