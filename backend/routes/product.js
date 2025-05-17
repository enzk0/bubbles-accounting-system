import express from "express";
import { authenticate } from "../middleware/auth.js";
import { checkPrivilege } from "../middleware/accessControl.js";
import {
    createProduct,
    deactivateProduct,
    editProduct,
    getAllProducts,
    getProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", authenticate, checkPrivilege(["admin"]), createProduct);

router.get("/all", authenticate, checkPrivilege([]), getAllProducts);

router.get("/:id", authenticate, checkPrivilege([]), getProduct);

router.patch("/:id", authenticate, checkPrivilege(["admin"]), editProduct);

router.delete("/", authenticate, checkPrivilege(["admin"]), deactivateProduct);

export default router;
