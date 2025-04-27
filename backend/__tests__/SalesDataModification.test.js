import {
  test,
  expect,
  describe,
  beforeEach,
  vi,
} from "vitest";
import request from "supertest";
import app from "../index"; // Ensure this points to your Express app
import { prismaMock } from "../singleton.js";
import { verifyUserRole } from "../auth/RoleVerification";

// Mocking the role verification
vi.mock("../auth/RoleVerification", () => ({
  verifyUserRole: vi.fn(),
}));

describe("Sales Data Modification", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test("Employee can toggle isPaid status", async () => {
    // Mock the role verification and sales data retrieval
    verifyUserRole.mockResolvedValue("employee");
    prismaMock.salesData.findUnique.mockResolvedValue({
      id: "123",
      isPaid: false,
      isClaimed: false, // Ensure this is false
    });
    prismaMock.salesData.update.mockResolvedValue({
      id: "123",
      isPaid: true,
      isClaimed: false, // Ensure this matches the expected result
    });
  
    // Sending a PUT request to update the sales data
    const response = await request(app)
      .put("/sales-data/123")
      .send({ isPaid: true })
      .set("Authorization", "Bearer employee-token");
  
    // Debugging the response
    console.log("Response body:", response.body);
  
    // Asserting the expected outcome
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "123",
      isPaid: true,
      isClaimed: false,
    });
  });

  test("Employee cannot modify when both isPaid and isClaimed are true", async () => {
    // Mock the role verification and sales data retrieval
    verifyUserRole.mockResolvedValue("employee");
    prismaMock.salesData.findUnique.mockResolvedValue({
      id: "123",
      isPaid: true,
      isClaimed: true,
    });

    // Sending a PUT request to update the sales data
    const response = await request(app)
      .put("/sales-data/123")
      .send({ isPaid: false })
      .set("Authorization", "Bearer employee-token");

    // Asserting the expected error
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Cannot modify when both isPaid and isClaimed are true.",
    });
  });

  test("Admin can modify all fields", async () => {
    // Mock the role verification and sales data retrieval
    verifyUserRole.mockResolvedValue("admin");
    prismaMock.salesData.findUnique.mockResolvedValue({
      id: "123",
      isPaid: false,
      isClaimed: false,
    });
    prismaMock.salesData.update.mockResolvedValue({
      id: "123",
      isPaid: true,
      isClaimed: true,
      customField: "newValue",
    });

    // Sending a PUT request to update the sales data
    const response = await request(app)
      .put("/admin/sales-data/123")
      .send({ isPaid: true, isClaimed: true, customField: "newValue" })
      .set("Authorization", "Bearer admin-token");

    // Asserting the expected outcome
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "123",
      isPaid: true,
      isClaimed: true,
      customField: "newValue",
    });
  });

  test("Non-admin cannot access admin routes", async () => {
    // Mock the role verification
    verifyUserRole.mockResolvedValue("employee");

    // Sending a PUT request to access an admin-only route
    const response = await request(app)
      .put("/admin/sales-data/123")
      .send({ isPaid: true })
      .set("Authorization", "Bearer employee-token");

    // Asserting the expected error
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden: Role not authorized.",
    });
  });

  test("Returns 404 if sales data not found", async () => {
    // Mock the role verification and sales data retrieval (not found case)
    verifyUserRole.mockResolvedValue("admin");
    prismaMock.salesData.findUnique.mockResolvedValue(null);

    // Sending a PUT request to update the sales data
    const response = await request(app)
      .put("/admin/sales-data/123")
      .send({ isPaid: true })
      .set("Authorization", "Bearer admin-token");

    // Asserting the expected error
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Sales data not found.",
    });
  });
});