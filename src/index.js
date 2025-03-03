// const express = require('express');
// const cors = require('cors');

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
const MONGO_URI = 'mongodb://mongo:27017/testing-db'//'mongodb://mongo:27017/dev-db-flash-sale-system';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.json({
    "name": "flash-sale-system",
    "version": "1.0.0",
    "description": "",
    "main": "src/index.js",
    "scripts": {
      "dev": "node --env-file-if-exists=.env --watch src/index.js",
      "start": "node src/index.js",
      "test": "NODE_ENV=testing node src/ --test --experimental-test-coverage"
    },
    "keywords": [],
    "author": "John Chioma",
    "license": "ISC",
    "dependencies": {
      "express": "^4.21.2",
      "mongoose": "^8.11.0"
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
