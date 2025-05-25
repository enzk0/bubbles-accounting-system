import { describe, test, expect, beforeEach, vi } from "vitest";
import request from 'supertest';
import express from 'express';
import salesRoutes from '../salesRoutes.js';

vi.mock('../../controllers/jobOrderModificationController.js', () => ({
  modifyJobOrder: vi.fn(),
}));

vi.mock('../../middleware/checkRole.js', async () => {
    const actual = await vi.importActual('../../middleware/checkRole.js');
    return {
        ...actual,
        default: vi.fn((roles) => (req, res, next) => {
            if (roles.includes(req.user.role)) {
                next();
            } else {
                return res.status(403).json({ error: 'Forbidden' });
            }
        }),
    };
});

import { modifyJobOrder } from '../../controllers/jobOrderModificationController.js';

const app = express();
app.use(express.json());
app.use(salesRoutes);

describe('Integration tests for salesRoutes', () => {
  beforeEach(() => {
    modifyJobOrder.mockImplementation((req, res) => {
      res.status(200).json({ message: `${req.user.role} modified job order ${req.params.id}` });
    });
  });

  test('should allow employee to modify job order', async () => {
    const res = await request(app)
      .patch('/employee/job-orders/1')
      .set('role', 'employee')
      .send({ isPaid: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('employee modified job order 1');
  });

  test('should allow admin to modify job order', async () => {
    const res = await request(app)
      .patch('/admin/job-orders/1')
      .set('role', 'admin')
      .send({ isPaid: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('admin modified job order 1');
  });

  test('should return 401 if role header is missing', async () => {
    const res = await request(app)
      .patch('/employee/job-orders/1')
      .send({ isPaid: true });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Missing role in headers');
  });

  test('should return 403 if role is not allowed', async () => {
    const res = await request(app)
      .patch('/admin/job-orders/1')
      .set('role', 'employee')
      .send({ isPaid: true });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });
});
