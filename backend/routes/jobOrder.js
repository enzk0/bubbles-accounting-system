import express from 'express';
import { countJobOrder, countJobOrderByBranch } from '../controllers/countJobOrder.js';
import { getAllJobOrder, getAllJobOrderByBranch } from '../controllers/getJobOrder.js';

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

export default router;