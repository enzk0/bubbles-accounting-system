import express from "express";
import {
    adminLogin,
    employeeLogin,
} from "../controllers/authenticationController";

const router = express.Router();

router.post("/login/employee", employeeLogin);

router.post("/login/admin", adminLogin);

export default router;
