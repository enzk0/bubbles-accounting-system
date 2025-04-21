import { countJobOrdersForDay } from "../controllers/countJobOrder.js";
import { test, expect, describe } from "vitest";
import { prismaMock } from "../singleton.js";

describe("UNIT TEST SUITE FOR 'countJobOrdersForDay()' FUNCTION", () => {
  test("countJobOrdersForDay() should return the correct count for a specific day", async () => {
    // Setup a specific test date
    const testDate = new Date('2025-04-15');
    
    // Calculate the expected start and end of day
    const startOfDay = new Date(testDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(testDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Mock the Prisma count method to return 5
    prismaMock.jobOrder.count.mockResolvedValue(5);
    
    // Call the function
    const count = await countJobOrdersForDay(testDate);
    
    // Assert that prisma was called with the correct parameters
    expect(prismaMock.jobOrder.count).toHaveBeenCalledWith({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    
    // Assert the result
    expect(count).toBe(5);
  });
  
  test("countJobOrdersForDay() should return 0 when no job orders exist for the day", async () => {
    // Setup a test date
    const testDate = new Date('2025-04-16');
    
    // Mock the Prisma count method to return 0
    prismaMock.jobOrder.count.mockResolvedValue(0);
    
    // Call the function
    const count = await countJobOrdersForDay(testDate);
    
    // Assert that prisma was called
    expect(prismaMock.jobOrder.count).toHaveBeenCalled();
    
    // Assert the result
    expect(count).toBe(0);
  });
  
  test("countJobOrdersForDay() should handle Date objects properly", async () => {
    // Test with different date creation methods
    const dateFromString = new Date('2025-04-17');
    const dateFromParts = new Date(2025, 3, 17); // April 17, 2025
    
    // Mock implementation to verify date comparisons
    prismaMock.jobOrder.count.mockImplementation((args) => {
      // Check if the dates in the query are equal to what we expect
      const queryStartDate = args.where.createdAt.gte;
      const queryEndDate = args.where.createdAt.lte;
      
      // Verify it's the same day (regardless of time)
      const isSameDay = 
        queryStartDate.getFullYear() === 2025 && 
        queryStartDate.getMonth() === 3 && 
        queryStartDate.getDate() === 17 &&
        queryEndDate.getFullYear() === 2025 && 
        queryEndDate.getMonth() === 3 && 
        queryEndDate.getDate() === 17;
      
      // Return mock count
      return Promise.resolve(isSameDay ? 3 : 0);
    });
    
    // Call the function with both date objects
    const countFromString = await countJobOrdersForDay(dateFromString);
    const countFromParts = await countJobOrdersForDay(dateFromParts);
    
    // Assert the results
    expect(countFromString).toBe(3);
    expect(countFromParts).toBe(3);
    expect(prismaMock.jobOrder.count).toHaveBeenCalledTimes(2);
  });
});