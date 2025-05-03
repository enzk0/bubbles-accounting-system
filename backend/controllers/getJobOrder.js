import { PrismaClient } from "@prisma/client";
import prisma from "../client.js";

async function getJobOrder() {
  const allJobOrders = await prisma.jobOrder.findMany({
    include: {
      branch: true,
      customer: true,
      user: true,
      jobOrderItems: true,
    },
  });
  return allJobOrders;
}

async function getJobOrderByBranch(branchId) {
  const JobOrders = await prisma.jobOrder.findMany({
    where: {
      branch: {
        id: branchId,
      },
    },
    include: {
      branch: true,
      customer: true,
      user: true,
      jobOrderItems: true,
    },
  });
  return JobOrders;
}

export async function getAllJobOrder(req, res) {
  try {
    console.log("Fetching job orders...");
    const jobOrders = await getJobOrder();
    console.log("jobOrders", jobOrders);

    if ( jobOrders == null || jobOrders == undefined) {
      console.log("No job orders found");
      return res.status(404).json({ error: "No job orders found" });
      console.log("Response sent");
    }

    if (jobOrders.length === 0) {
      return res.status(404).json({ error: "No job orders found" });
    }

    const result = jobOrders;

    return result
  } catch (error) {
    console.error("Error getting job orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllJobOrderByBranch(req, res) { 
  const { branchId } = req.body;

  if (!branchId) {
    return res.status(400).json({ error: "Branch ID is not provided"});
  }

  try {
    const jobOrders = await getJobOrderByBranch(branchId);
    console.log("jobOrders", jobOrders);

    if ( jobOrders == null || jobOrders == undefined) {
      console.log("No job orders found");
      return res.status(404).json({ error: "No job orders found" });
      console.log("Response sent");
    }

    if (jobOrders.length === 0) {
      return res.status(404).json({ error: "No job orders found" });
    }

    const result = jobOrders;

    return result
  } catch (error) {
    console.error("Error getting job orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}