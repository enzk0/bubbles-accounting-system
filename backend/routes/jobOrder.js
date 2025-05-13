import express from 'express';
import bodyParser from 'body-parser';
import { countJobOrder, countJobOrderByBranch } from '../controllers/countJobOrder.js';
import { getAllJobOrder, getAllJobOrderByBranch, getJobOrderByIdController } from '../controllers/getJobOrder.js';
import { modifyJobOrder as employeeModify } from '../controllers/employeeController.js';
import { modifyJobOrder as adminModify } from '../controllers/adminController.js';

const router = express.Router();

router.use(bodyParser.urlencoded({  extended: true  }));

//summarizes job orders depending on interval
router.get('/count', countJobOrder);

//needs params
router.get('/count-by-branch', countJobOrderByBranch);

//gets all job orders
router.get('/get', getAllJobOrder);

//gets all job orders depending on branch
router.get('/get-by-branch', getAllJobOrderByBranch);

router.patch('/employee/job-orders/:id', async (req, res) => {
  try {
    console.log('Employee job order modification request received');
    // employeeModify
    res.status(200).send({
      type: "PATCH",
      request: "Employee job order modification request received",
      message: "Successfully received PATCH request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.patch('/admin/job-orders/:id', async (req, res) => {
  try {
    console.log('Admin job order modification request received');
    // adminModify
    res.status(200).send({
      type: "PATCH",
      request: "Admin job order modification request received",
      message: "Successfully received PATCH request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

export default router;