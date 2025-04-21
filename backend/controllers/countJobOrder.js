import prisma from "../client";

//Some ways to use dates
// 1: Current Date
const today = new Date();
countJobOrdersForDay(today);

// 2: Using a specific date
const specificDate = new Date('2025-04-15'); // April 15, 2025
countJobOrdersForDay(specificDate);

// 3: Creating a date from year, month (0-11), and day
const dateFromParts = new Date(2025, 3, 15); // April 15, 2025 (month is 0-indexed)
countJobOrdersForDay(dateFromParts);

// 5: If you receive date as a string from user input
function countOrdersFromUserInput(dateString) {
  // Parse the string into a Date object
  const date = new Date(dateString); // e.g., '2025-04-15' or 'April 15, 2025'
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  
  return countJobOrdersForDay(date);
}

async function countJobOrdersForDay(date) {
  // Create start and end dates for the given day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Query using Prisma client
  const count = await prisma.jobOrder.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
  
  return count;
}

// Example usage: Count job orders created today
countJobOrdersForDay(today).then(count => {
  console.log(`Job orders created today: ${count}`);
});

async function countJobOrdersByDateRange(startDate, endDate) {
  try {
    // Add error handling and ensure we initialize with an array if query fails
    const jobOrders = await prisma.jobOrder.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    }) || [];
    
    // Group by day
    const dailyCounts = {};
    
    jobOrders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD format
      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
    });
    
    return dailyCounts;
  } catch (error) {
    console.error("Error counting job orders by date range:", error);
    return {}; // Return empty object in case of error
  }
}

// Count orders for the past week
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);

countJobOrdersByDateRange(startDate, endDate).then(dailyCounts => {
  console.log('Daily job order counts for the past week:', dailyCounts);
});

// Count Orders by Branch for a specific day
async function countJobOrdersByBranchForDay(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const branchCounts = await prisma.branch.findMany({
    select: {
      id: true,
      code: true,
      _count: {
        select: {
          JobOrder: {
            where: {
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          },
        },
      },
    },
  });
  
  return branchCounts.map(branch => ({
    branchId: branch.id,
    branchCode: branch.code,
    orderCount: branch._count.JobOrder,
  }));
}

export { countJobOrdersForDay, countOrdersFromUserInput, countJobOrdersByDateRange, countJobOrdersByBranchForDay };