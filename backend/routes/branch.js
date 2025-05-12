import express from "express";
import { createBranch } from "../controllers/branchController";

const router = express.Router();

router.post("/create", createBranch);

export default router;
