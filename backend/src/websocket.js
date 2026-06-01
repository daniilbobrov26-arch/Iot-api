const WebSocket = require('ws');

function initWebsocket(server, deviceService, mqttService) {
    const wss = new WebSocket.Server({
        server,
        path: '/ws'
    });

    const heartbeatIntervalMs = 30000;

    function broadcast(data) {
        const payload = JSON.stringify(data);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }

    mqttService.setBroadcast(broadcast);

    wss.on('connection', (ws) => {
        ws.isAlive = true;

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.send(JSON.stringify({
            type: 'init',
            devices: deviceService.getDevices()
        }));

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);

                if (data.type === 'toggle') {
                    mqttService.publishCommand(data.uuid, data.action);
                }
            } catch (error) {
                console.error('Invalid websocket message', error);
            }
        });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                ws.terminate();
                return;
            }

            ws.isAlive = false;
            ws.ping();
        });
    }, heartbeatIntervalMs);

    wss.on('close', () => {
        clearInterval(interval);
    });
}

module.exports = initWebsocket;
