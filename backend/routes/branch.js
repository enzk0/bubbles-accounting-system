import express from "express";
import { createBranch, getBranch } from "../controllers/branchController";
import { authenticate } from "../middleware/auth";
import { checkPrivilege } from "../middleware/accessControl";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createBranch);

router.get("/", authenticate, checkPrivilege([]), getBranch);

export default router;
