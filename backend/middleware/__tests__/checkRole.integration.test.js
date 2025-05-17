import { describe, test, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import checkRole from '../checkRole.js';

const simplecontroller = (req, res) => {
  res.status(200).json({ message: 'Access granted' });
};

describe('Integration Test for checkRole Middleware', () => {
  const app = express();

  app.use((req, res, next) => {
    const role = req.headers['role'];
    if (role) {
      req.user = { role };
    }
    next();
  });

  app.get('/protected', checkRole('admin'), simplecontroller);

  test('should allow access when role is admin', async () => {
    const response = await request(app)
      .get('/protected')
      .set('role', 'admin');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Access granted');
  });

  test('should deny access when role is not admin', async () => {
    const response = await request(app)
      .get('/protected')
      .set('role', 'employee');

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Access denied: Unauthorized role');
  });

  test('should allow access when role is employee', async () => {
    const response = await request(app)
      .get('/protected')
      .set('role', 'employee');

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Access denied: Unauthorized role');
  });


  test('should deny access when role header is missing', async () => {
    const response = await request(app)
      .get('/protected');

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Access denied: Unauthorized role');
  });
});
