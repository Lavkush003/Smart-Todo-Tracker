import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/todos returns a list', async () => {
  const response = await request(app).get('/api/todos');
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
});

test('GET /api/todos/:id returns a todo or 404', async () => {
  const listResponse = await request(app).get('/api/todos');
  const firstTodo = listResponse.body.data[0];

  if (firstTodo) {
    const response = await request(app).get(`/api/todos/${firstTodo.id}`);
    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.id, firstTodo.id);
  }

  const missingResponse = await request(app).get('/api/todos/999999');
  assert.equal(missingResponse.status, 404);
  assert.equal(missingResponse.body.success, false);
});

test('POST /api/todos creates a todo', async () => {
  const response = await request(app).post('/api/todos').send({
    title: 'Test todo creation',
    description: 'Created by automated backend test',
    status: 'pending',
    priority: 'high',
    due_date: '2026-09-15',
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.title, 'Test todo creation');
});

test('PUT /api/todos/:id updates a todo', async () => {
  const createResponse = await request(app).post('/api/todos').send({
    title: 'Editable test todo',
    description: 'To be updated',
    status: 'pending',
    priority: 'medium',
    due_date: '2026-09-16',
  });

  const response = await request(app).put(`/api/todos/${createResponse.body.data.id}`).send({
    title: 'Updated test todo',
    status: 'completed',
    priority: 'high',
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.title, 'Updated test todo');
});

test('DELETE /api/todos/:id removes a todo', async () => {
  const createResponse = await request(app).post('/api/todos').send({
    title: 'Delete me',
    description: 'Temporary task',
    status: 'pending',
    priority: 'low',
    due_date: '2026-09-20',
  });

  const response = await request(app).delete(`/api/todos/${createResponse.body.data.id}`);
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
});

test('Validation rejects invalid payloads', async () => {
  const response = await request(app).post('/api/todos').send({
    title: '',
    status: 'wrong-status',
    priority: 'urgent',
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});
