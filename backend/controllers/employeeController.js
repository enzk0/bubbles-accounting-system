import { verifyUserRole } from './RoleVerification';
import { getSalesDataById, updateSalesData } from './SalesDataService';

export const modifySalesData = async (req, res) => {
  const userId = req.userId; // Assume userId comes from authentication middleware
  const { id } = req.params; // Sales data ID
  const { isPaid, isClaimed } = req.body; // Fields to be modified

  try {
    const role = await verifyUserRole(userId);
    if (role !== 'employee') {
      return res.status(403).json({ message: 'Forbidden: Role not authorized.' });
    }

    const salesData = await getSalesDataById(id);
    if (!salesData) {
      return res.status(404).json({ message: 'Sales data not found.' });
    }

    // Check conditions for toggling `isPaid` and `isClaimed`
    if (isPaid !== undefined || isClaimed !== undefined) {
      if (salesData.isPaid && salesData.isClaimed) {
        return res.status(400).json({ message: 'Cannot modify when both isPaid and isClaimed are true.' });
      }

      // Update only the allowed fields
      salesData.isPaid = isPaid !== undefined ? isPaid : salesData.isPaid;
      salesData.isClaimed = isClaimed !== undefined ? isClaimed : salesData.isClaimed;
      const updatedData = await updateSalesData(id, salesData);
      return res.status(200).json(updatedData);
    }

    return res.status(400).json({ message: 'No valid fields to update.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};
