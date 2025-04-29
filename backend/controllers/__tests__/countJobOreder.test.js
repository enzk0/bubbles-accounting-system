import { PrismaClient } from "@prisma/client";
import { countJobOrder } from "../controllers/countJobOrder"; 

const prisma = new PrismaClient();

// Mock Express req/res objects
const mockRequest = (data) => ({
  query: data,
  body: data,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("INTEGRATION TESTS FOR 'countJobOrder()' CONTROLLER", () => {
  // We're using the seeded database, so no need for beforeEach/afterEach setup

  test("countJobOrder() should return correct counts when querying by month interval", async () => {
    const req = mockRequest({
      interval: "month"
    });
    
    const res = mockResponse();
    
    await countJobOrder(req, res);
    
    // Verify status code
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Get the data that was passed to res.json
    const responseData = res.json.mock.calls[0][0].data;
    
    // Verify structure
    expect(responseData).toBeInstanceOf(Array);
    expect(responseData.length).toBeGreaterThan(0);
    
    // Verify each entry has the expected properties
    const firstEntry = responseData[0];
    expect(firstEntry).toHaveProperty('interval_start');
    expect(firstEntry).toHaveProperty('total');
    expect(firstEntry).toHaveProperty('total_paid');
    expect(firstEntry).toHaveProperty('total_unpaid');
    expect(firstEntry).toHaveProperty('no_of_job_orders');
    
    // Based on the seed data, we know there should be 5 job orders
    const totalJobOrders = responseData.reduce((sum, entry) => sum + Number(entry.no_of_job_orders), 0);
    expect(totalJobOrders).toBe(5);
  });
});