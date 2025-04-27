import { verifyUserRole } from './RoleVerification';
import { getSalesDataById, updateSalesData } from './SalesDataService';

export const modifySalesData = async (req, res) => {
  const userId = req.userId; // Assume userId comes from authentication middleware
  const { id } = req.params; // Sales data ID
  const updatedFields = req.body; // Fields to be modified

  try {
    const role = await verifyUserRole(userId);
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Role not authorized.' });
    }

    const salesData = await getSalesDataById(id);
    if (!salesData) {
      return res.status(404).json({ message: 'Sales data not found.' });
    }

    // Update all fields provided in the request body
    const updatedData = await updateSalesData(id, { ...salesData, ...updatedFields });
    return res.status(200).json(updatedData);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};
