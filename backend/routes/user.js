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

router.get("/all", authenticate, checkPrivilege(["admin"]), getAllUsers);

router.get("/:id", authenticate, checkPrivilege([]), getUser);

router.patch("/", authenticate, checkPrivilege(["admin"]), editUser);

router.patch(
    "/password",
    authenticate,
    checkPrivilege(["admin"]),
    editPassword
);

router.delete("/", authenticate, checkPrivilege(["admin"]), deactivateUser);

export default router;
