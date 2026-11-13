'use strict';

const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;

createApp().listen(port, () => {
  console.log(`agent-sandbox listening on http://localhost:${port}`);
});
