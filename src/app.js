'use strict';

const express = require('express');

const MAX_NAME_LENGTH = 100;

function createApp() {
  const app = express();
  app.use(express.json({ limit: '10kb' }));

  const items = [];

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/items', (req, res) => {
    res.json(items);
  });

  app.post('/items', (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!name || name.length > MAX_NAME_LENGTH) {
      return res
        .status(400)
        .json({ error: `name must be a non-empty string of at most ${MAX_NAME_LENGTH} characters` });
    }
    const item = { id: items.length + 1, name };
    items.push(item);
    return res.status(201).json(item);
  });

  return app;
}

module.exports = { createApp };
