import * as jobOrderService from '../services/jobOrderService.js';

const modifyJobOrder = async (req, res) => {

  const job = await jobOrderService.findJobOrderById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job order not found' });
  }

  const role = req.user?.role;

  if (role === 'employee') {
    const { isPaid, isClaimed } = req.body;

    if (job.isPaid && job.isClaimed) {
      return res.status(400).json({ error: 'Cannot modify when both isPaid and isClaimed are true' });
    }

    const updateData = {};

    if (typeof isPaid === 'boolean') {
      updateData.isPaid = isPaid;
    }

    if (typeof isClaimed === 'boolean') {
      updateData.isClaimed = isClaimed;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updatedJob = await jobOrderService.updateJobOrder(req.params.id, updateData);

    return res.json({ updatedJob });
  }

  if (role === 'admin') {
    const updatedJob = await jobOrderService.updateJobOrder(req.params.id, req.body);
    return res.json({ updatedJob });
  }

  return res.status(403).json({ error: 'Access Blocked: Role not authorized' });
};

export { modifyJobOrder };
