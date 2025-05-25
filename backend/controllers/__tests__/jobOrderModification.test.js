import { describe, test, expect, vi, beforeEach } from 'vitest';
import { modifyJobOrder } from '../jobOrderModificationController.js';
import * as jobOrderService from '../../services/jobOrderService.js';

vi.mock('../../services/jobOrderService.js', () => ({
  findJobOrderById: vi.fn(),
  updateJobOrder: vi.fn(),
}));

const mockRequest = (params = {}, body = {}, user = { role: 'employee' }) => ({
  params,
  body,
  user,
});

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('modifyJobOrder Controller (Unit Test)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return 404 if job order not found', async () => {
    const req = mockRequest({ id: '1' }, {});
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue(null);

    await modifyJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Job order not found' });
  });

  test('should allow employee to toggle isPaid', async () => {
    const req = mockRequest({ id: '1' }, { isPaid: true });
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ id: 1, isPaid: false, isClaimed: false });
    jobOrderService.updateJobOrder.mockResolvedValue({ id: 1, isPaid: true });

    await modifyJobOrder(req, res);

    expect(res.json).toHaveBeenCalledWith({ updatedJob: { id: 1, isPaid: true } });
  });

  test('should allow employee to toggle isClaimed', async () => {
    const req = mockRequest({ id: '1' }, { isClaimed: true });
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ id: 1, isPaid: false, isClaimed: false });
    jobOrderService.updateJobOrder.mockResolvedValue({ id: 1, isClaimed: true });

    await modifyJobOrder(req, res);

    expect(res.json).toHaveBeenCalledWith({ updatedJob: { id: 1, isClaimed: true } });
  });

  test('should allow employee to toggle both isPaid and isClaimed', async () => {
    const req = mockRequest({ id: '1' }, { isPaid: true, isClaimed: true });
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ id: 1, isPaid: false, isClaimed: false });
    jobOrderService.updateJobOrder.mockResolvedValue({ id: 1, isPaid: true, isClaimed: true });

    await modifyJobOrder(req, res);

    expect(res.json).toHaveBeenCalledWith({ updatedJob: { id: 1, isPaid: true, isClaimed: true } });
  });

  test('should block employee when both isPaid and isClaimed are already true', async () => {
    const req = mockRequest({ id: '1' }, { isPaid: false });
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ id: 1, isPaid: true, isClaimed: true });

    await modifyJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cannot modify when both isPaid and isClaimed are true' });
  });

  test('should return 400 if employee sends no valid fields', async () => {
    const req = mockRequest({ id: '1' }, { customerName: 'Hacker' });
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ id: 1, isPaid: false, isClaimed: false });

    await modifyJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No valid fields to update' });
  });

  test('should allow admin to update all fields', async () => {
    const req = mockRequest({ id: '1' }, { customerName: 'AdminEdit' }, { role: 'admin' });
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ id: 1, isPaid: false, isClaimed: false });
    jobOrderService.updateJobOrder.mockResolvedValue({ id: 1, customerName: 'AdminEdit' });

    await modifyJobOrder(req, res);

    expect(res.json).toHaveBeenCalledWith({ updatedJob: { id: 1, customerName: 'AdminEdit' } });
  });

  test('should return 403 for invalid role', async () => {
    const req = mockRequest({ id: '1' }, {}, { role: 'guest' });
    const res = mockResponse();

    jobOrderService.findJobOrderById.mockResolvedValue({ id: 1, isPaid: false, isClaimed: false });

    await modifyJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access Blocked: Role not authorized' });
  });
});
