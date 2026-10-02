process.env.DB_PATH = ':memory:';
process.env.ADMIN_KEY = 'test-key';
const request = require('supertest');
const { app } = require('./app');

test('health works', async () => {
  const r = await request(app).get('/health');
  expect(r.statusCode).toBe(200);
});
test('menu returns items', async () => {
  const r = await request(app).get('/api/menu');
  expect(r.body.length).toBeGreaterThan(0);
});

test('creates an order', async () => {
  const r = await request(app).post('/api/orders').send({
    customer_name: 'Tarun', customer_phone: '9876543210', table_no: 7,
    items: [{ id: 1, name: 'Crispy corn chaat', quantity: 2 }], total: 12, payment_method: 'upi'
  });
  expect(r.statusCode).toBe(201);
  expect(r.body.status).toBe('confirmed');
  expect(r.body.customer_name).toBe('Tarun');
  expect(r.body.items[0].quantity).toBe(2);
});

test('rejects a status update without the admin key', async () => {
  const r = await request(app).patch('/api/orders/1/status').send({ status: 'received' });
  expect(r.statusCode).toBe(401);
});

test('updates status with the admin key', async () => {
  const r = await request(app).patch('/api/orders/1/status').set('x-admin-key', 'test-key').send({ status: 'preparing' });
  expect(r.statusCode).toBe(200);
  expect(r.body.status).toBe('preparing');
});