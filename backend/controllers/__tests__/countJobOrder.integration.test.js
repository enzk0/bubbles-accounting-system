import { PrismaClient } from "@prisma/client";
import { countJobOrder } from "../controllers/countJobOrder"; 

const prisma = new PrismaClient();

// Mock Express req/res objects
const mockRequest = (data) => ({
  query: data,
  body: data,
});


describe("INTEGRATION TESTS FOR 'countJobOrder()' CONTROLLER", () => {
  // We're using the seeded database, so no need for beforeEach/afterEach setup

  test("countJobOrder() should return the count of job orders for today", async () => {


    await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData).toHaveProperty("count");
    expect(responseData.count).toBeDefined();
    expect(responseData.count).toBeGreaterThanOrEqual(0); // Assuming there are job orders  
  });
});