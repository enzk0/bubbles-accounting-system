import express from "express";
import {
    createBranch,
    editBranch,
    getAllBranches,
    getBranch,
} from "../controllers/branchController";
import { authenticate } from "../middleware/auth";
import { checkPrivilege } from "../middleware/accessControl";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createBranch);

router.get("/", authenticate, checkPrivilege([]), getBranch);

router.get("/all", authenticate, checkPrivilege(["admin"]), getAllBranches);

router.patch("/", authenticate, checkPrivilege(["admin"]), editBranch);

export default router;
