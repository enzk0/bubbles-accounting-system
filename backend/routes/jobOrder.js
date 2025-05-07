import express from 'express';
import { countJobOrder, countJobOrderByBranch } from '../controllers/countJobOrder.js';
import { getAllJobOrder, getAllJobOrderByBranch } from '../controllers/getJobOrder.js';
import { modifyJobOrder as employeeModify } from '../controllers/employeeController.js';
import { modifyJobOrder as adminModify } from '../controllers/adminController.js';

const router = express.Router();

router.get('/count', async (req, res) => { 
  try { 
    console.log('Job Order count request received');
    //countJobOrder
    res.status(200).send({
      type: "GET",
      request: "Job Order count request received",
      message: "Successfully received GET request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get('/count-by-branch', async (req, res) => { 
  try { 
    console.log('Job Order count by branch request received');
    //countJobOrderByBranch
    res.status(200).send({
      type: "GET",
      request: "Job Order count by branch request received",
      message: "Successfully received GET request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get('/get', async (req, res) => { 
  try { 
    console.log('Job Order get request received');
    //getAllJobOrder
    res.status(200).send({
      type: "GET",
      request: "Job Order get request received",
      message: "Successfully received GET request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get('/get-by-branch', async (req, res) => { 
  try { 
    console.log('Job Order get by branch request received');
    //getAllJobOrderByBranch
    res.status(200).send({
      type: "GET",
      request: "Job Order get by branch request received",
      message: "Successfully received GET request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

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