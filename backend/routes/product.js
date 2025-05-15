import express from "express";
import { authenticate } from "../middleware/auth";
import { checkPrivilege } from "../middleware/accessControl";
import { createProduct } from "../controllers/productController";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createProduct);

export default router;
