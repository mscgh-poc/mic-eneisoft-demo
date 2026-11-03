'use strict';

const request = require('supertest');
const { app } = require('../src/server');

describe('GET /api/info', () => {
  test('returns deployment info', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('content');
    expect(res.body).toHaveProperty('build');
    expect(res.body).toHaveProperty('runtime');
    expect(res.body).toHaveProperty('kubernetes');
    expect(res.body.content).toHaveProperty('message');
    expect(res.body.build).toHaveProperty('version');
  });
});
