import express from "express";
import { authenticate } from "../middleware/auth.js";
import { checkPrivilege } from "../middleware/accessControl.js";
import {
    countJobOrders,
    createJobOrder,
    editJobOrderStatus,
    getAllJobOrders,
    getAssignedJobOrders,
    getJobOrder,
} from "../controllers/jobOrderController.js";
const router = express.Router();

router.post("/", authenticate, checkPrivilege([]), createJobOrder);

router.get(
    "/assigned",
    authenticate,
    checkPrivilege(["employee"]),
    getAssignedJobOrders
);

router.get("/all", authenticate, checkPrivilege(["admin"]), getAllJobOrders);

router.get("/", authenticate, checkPrivilege([]), getJobOrder);

router.get("/count", authenticate, checkPrivilege(["admin"]), countJobOrders);

router.patch("/status", authenticate, checkPrivilege([]), editJobOrderStatus);

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
