import express from "express";
import {
    createUser,
    deactivateUser,
    editUser,
    editPassword,
    getUser,
    getAllUsers,
    getSelf,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { checkPrivilege } from "../middleware/accessControl.js";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createUser);

router.get("/self", authenticate, checkPrivilege([]), getSelf);

router.get("/all", authenticate, checkPrivilege(["admin"]), getAllUsers);

router.get("/:id", authenticate, checkPrivilege([]), getUser);

router.patch(
    "/password/:id",
    authenticate,
    checkPrivilege(["admin"]),
    editPassword
);

router.patch("/:id", authenticate, checkPrivilege(["admin"]), editUser);

router.delete("/:id", authenticate, checkPrivilege(["admin"]), deactivateUser);

export default router;
