const express = require('express');
const http = require('http');

const deviceService = require('./deviceService');
const mqttService = require('./mqtt');
const initWebsocket = require('./websocket');

const app = express();

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

const server = http.createServer(app);

deviceService.loadDevices(() => {
    initWebsocket(server, deviceService, mqttService);

    server.listen(process.env.PORT, () => {
        console.log('Server started');
    });
});