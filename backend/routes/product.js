import express from "express";
import { authenticate } from "../middleware/auth";
import { checkPrivilege } from "../middleware/accessControl";
import {
    createProduct,
    getAllProducts,
    getProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createProduct);

router.get("/", authenticate, checkPrivilege([]), getProduct);

router.get("/all", authenticate, checkPrivilege([]), getAllProducts);

export default router;
