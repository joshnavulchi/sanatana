// scripts/socket-server.js
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());

let dashboardData = {};

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Health check endpoint for static clients
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dashboardData });
});

io.on('connection', (socket) => {
  socket.emit('dashboard:update', dashboardData);

  socket.on('dashboard:metric', (metric) => {
    dashboardData[metric.page] = {
      ...dashboardData[metric.page],
      ...metric.data,
      lastUpdated: Date.now(),
    };
    io.emit('dashboard:update', dashboardData);
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Socket.IO server running on :${PORT}`));
