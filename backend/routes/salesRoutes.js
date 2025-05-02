import express from 'express';
import { modifyJobOrder as employeeModify } from '../controllers/employeeController.js';
import { modifyJobOrder as adminModify } from '../controllers/adminController.js';
import checkRole from '../auth/checkRole.js';

const router = express.Router();

// Simulated auth
router.use((req, res, next) => {
  req.user = { id: 1, role: req.headers['role'] }; // simulate user role
  next();
});

router.patch('/employee/job-orders/:id', checkRole('employee'), employeeModify);
router.patch('/admin/job-orders/:id', checkRole('admin'), adminModify);

export default router;
