import express from "express";
import {
    createBranch,
    deactivateBranch,
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

router.delete("/", authenticate, checkPrivilege(["admin"]), deactivateBranch);

export default router;
