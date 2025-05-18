import express from "express";
import {
    countJobOrder,
    countJobOrderByBranch,
} from "../controllers/countJobOrder.js";
import {
    getAllJobOrder,
    getAllJobOrderByBranch,
} from "../controllers/getJobOrder.js";
import { authenticate } from "../middleware/auth.js";
import { checkPrivilege } from "../middleware/accessControl.js";
import {
    createJobOrder,
    getJobOrder,
} from "../controllers/jobOrderController.js";
const router = express.Router();

router.post("/", authenticate, checkPrivilege([]), createJobOrder);

router.get("/all", authenticate, checkPrivilege([]), getAllJobOrder);

router.get("/", authenticate, checkPrivilege([]), getJobOrder);

router.get("/count", authenticate, checkPrivilege(["admin"]), countJobOrder);

// router.get(
//     "/count-by-branch",
//     authenticate,
//     checkPrivilege(["admin"]),
//     countJobOrderByBranch
// );

// router.get(
//     "/get-by-branch",
//     authenticate,
//     checkPrivilege([]),
//     getAllJobOrderByBranch
// );

router.patch("/employee/job-orders/:id", async (req, res) => {
    try {
        console.log("Employee job order modification request received");
        // employeeModify
        res.status(200).send({
            type: "PATCH",
            request: "Employee job order modification request received",
            message: "Successfully received PATCH request.",
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

router.patch("/admin/job-orders/:id", async (req, res) => {
    try {
        console.log("Admin job order modification request received");
        // adminModify
        res.status(200).send({
            type: "PATCH",
            request: "Admin job order modification request received",
            message: "Successfully received PATCH request.",
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

export default router;
