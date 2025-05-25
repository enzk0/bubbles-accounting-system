import { describe, test, expect, vi } from "vitest";
import { modifyJobOrder } from "../jobOrderModificationController.js";
import * as jobOrderService from "../../services/jobOrderService.js";

vi.mock("../../services/jobOrderService.js");

const mockRequest = (params = {}, body = {}, role = "employee") => ({
  params,
  body,
  user: { id: 1, role },
});

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockJobOrder = {
  id: 1,
  isPaid: false,
  isClaimed: false,
  customerName: "Old Name",
};

describe("INTEGRATION TESTS FOR 'modifyJobOrder()' CONTROLLER", () => {
  test("should allow employee to toggle isPaid field", async () => {
    const req = mockRequest({ id: "1" }, { isPaid: true }, "employee");
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue(mockJobOrder);
    jobOrderService.updateJobOrder.mockResolvedValue({ ...mockJobOrder, isPaid: true });

    await modifyJobOrder(req, res);

    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      updatedJob: { ...mockJobOrder, isPaid: true },
    });
  });

  test("should block employee if job is already paid and claimed", async () => {
    const req = mockRequest({ id: "1" }, { isPaid: true }, "employee");
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ ...mockJobOrder, isPaid: true, isClaimed: true });

    await modifyJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Cannot modify when both isPaid and isClaimed are true" });
  });

  test("should allow admin to update other fields", async () => {
    const req = mockRequest({ id: "1" }, { customerName: "Updated Name" }, "admin");
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue(mockJobOrder);
    jobOrderService.updateJobOrder.mockResolvedValue({ ...mockJobOrder, customerName: "Updated Name" });

    await modifyJobOrder(req, res);

    expect(res.json).toHaveBeenCalledWith({
      updatedJob: { ...mockJobOrder, customerName: "Updated Name" },
    });
  });

  test("should return 403 if invalid role is provided", async () => {
    const req = mockRequest({ id: "1" }, { isPaid: true }, "invalidRole");
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue(mockJobOrder);

    await modifyJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Access Blocked: Role not authorized" });
  });

  test("should return 404 if job order not found", async () => {
    const req = mockRequest({ id: "999" }, { isPaid: true }, "employee");
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue(null);

    await modifyJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Job order not found" });
  });
});
