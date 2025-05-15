import express from "express";
import {
    adminLogin,
    employeeLogin,
} from "../controllers/authenticationController";

const router = express.Router();

router.post("/employee", employeeLogin);

router.post("/admin", adminLogin);

export default router;
