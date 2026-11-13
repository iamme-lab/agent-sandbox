'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

function postItem(body) {
  return fetch(`${baseUrl}/items`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('GET /health reports ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('POST /items creates an item and GET /items lists it', async () => {
  const created = await postItem({ name: '  first  ' });
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), { id: 1, name: 'first' });

  const list = await fetch(`${baseUrl}/items`);
  assert.deepEqual(await list.json(), [{ id: 1, name: 'first' }]);
});

test('POST /items rejects a blank or too long name', async () => {
  assert.equal((await postItem({ name: '   ' })).status, 400);
  assert.equal((await postItem({ name: 'x'.repeat(101) })).status, 400);
  assert.equal((await postItem({})).status, 400);
});
