import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';
import request from 'supertest';
import express from 'express';
import salesRoutes from '../routes/salesRoutes.js';
import * as jobOrderService from '../services/jobOrderService.js';

vi.mock('../services/jobOrderService.js', () => ({
  findJobOrderById: vi.fn((id) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, isPaid: false, isClaimed: false });
    }
    return Promise.resolve(null);
  }),
  updateJobOrder: vi.fn((id, data) => Promise.resolve({ id: 1, ...data })),
}));

const app = express();
app.use(express.json());
app.use('/api', salesRoutes);

describe('Admin Controller - Job Order Modification', () => {
  beforeAll(() => {
  });

  afterAll(() => {
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
  });

  test('should allow admin to modify all fields', async () => {
    const res = await request(app)
      .patch('/api/admin/job-orders/1')
      .set('role', 'admin')
      .send({ customerName: 'Admin Edit', isPaid: true });

    expect(res.status).toBe(200);
    expect(res.body.updatedJob.customerName).toBe('Admin Edit');
    expect(res.body.updatedJob.isPaid).toBe(true);
  });

  test('should return 404 if job order is not found', async () => {
    jobOrderService.findJobOrderById.mockResolvedValueOnce(null);

    const res = await request(app)
      .patch('/api/admin/job-orders/999')
      .set('role', 'admin')
      .send({ customerName: 'No One' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Job order not found');
  });
});
