import express from "express";
import { authenticate } from "../middleware/auth";
import { checkPrivilege } from "../middleware/accessControl";
import {
    createProduct,
    deactivateProduct,
    editProduct,
    getAllProducts,
    getProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createProduct);

router.get("/", authenticate, checkPrivilege([]), getProduct);

router.get("/all", authenticate, checkPrivilege([]), getAllProducts);

router.patch("/", authenticate, checkPrivilege(["admin"]), editProduct);

router.delete("/", authenticate, checkPrivilege(["admin"]), deactivateProduct);

export default router;
