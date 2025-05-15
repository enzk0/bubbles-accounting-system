import express from "express";
import { authenticate } from "../middleware/auth";
import { checkPrivilege } from "../middleware/accessControl";
import { createProduct, getProduct } from "../controllers/productController";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createProduct);

router.get("/", authenticate, checkPrivilege([]), getProduct);

export default router;
