// controllers/employeeController.js
import * as jobOrderService from '../services/jobOrderService.js';

const modifyJobOrder = async (req, res) => {
  const job = await jobOrderService.findJobOrderById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job order not found' });

  const { isPaid, isClaimed } = req.body;

  if (job.isPaid && job.isClaimed) {
    return res.status(400).json({ error: 'Cannot modify when both isPaid and isClaimed are true' });
  }

  const updateData = {};
  if (typeof isPaid === 'boolean') updateData.isPaid = isPaid;
  if (typeof isClaimed === 'boolean') updateData.isClaimed = isClaimed;

  const updatedJob = await jobOrderService.updateJobOrder(req.params.id, updateData);
  res.json({ updatedJob });
};

export { modifyJobOrder };
