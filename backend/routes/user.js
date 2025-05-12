import express from 'express';
import { createUser, deactivateUser, editUser, editPassword, getUser, getAllUsers } from '../controllers/userController.js';


const router = express.Router();

router.post('/create', (req, res) => {
  try {
    console.log('User creation request received');
    // createUser

    res.status(200).send({
      type: "POST",
      request: "User creation request received",
      message: "Successfully received POST request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.post('/deactivate', (req, res) => {
  try {
    console.log('User deactivation request received');
    // deactivateUser

    res.status(200).send({
      type: "POST",
      request: "User deactivation requrest received",
      message: "Successfully received POST request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.put('/edit', (req, res) => { 
  try {
    console.log('User edit request received');   
    //editUser

    res.status(200).send({
      type: "PUT",
      request: "User edit re`quest received",
      message: "Successfully received PUT request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.patch('/edit-password', (req, res) => {
  try {
    console.log('User password edit request received');
    //editPassword

    res.status(200).send({
      type: "PATCH",
      request: "User password edit request received",
      message: "Successfully received PATCH request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get('/get', (req, res) => {
  try {
    console.log('User retrieval request received');
    //getUser

    res.status(200).send({
      type: "GET",
      request: "User retrieval request received",
      message: "Successfully received GET request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get('/get-all', (req, res) => {
  try {
    console.log('All users retrieval request received'); 
    //getAllUsers

    res.status(200).send({
      type: "GET",
      request: "All user retrieval request received",
      message: "Successfully received GET request.",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

export default router;