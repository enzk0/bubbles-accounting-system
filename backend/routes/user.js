import express from "express";
import {
    createUser,
    deactivateUser,
    editUser,
    editPassword,
    getUser,
    getAllUsers,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { checkPrivilege } from "../middleware/accessControl.js";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createUser);

router.get("/", authenticate, checkPrivilege([]), getUser);

export default router;

