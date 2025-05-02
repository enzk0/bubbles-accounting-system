// controllers/adminController.js
import * as jobOrderService from '../services/jobOrderService.js';

const modifyJobOrder = async (req, res) => {
  const job = await jobOrderService.findJobOrderById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job order not found' });

  const updatedJob = await jobOrderService.updateJobOrder(req.params.id, req.body);
  res.json({ updatedJob });
};

export { modifyJobOrder };
