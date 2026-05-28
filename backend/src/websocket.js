const WebSocket = require('ws');

function initWebsocket(server, deviceService, mqttService) {
    const wss = new WebSocket.Server({
        server,
        path: '/ws'
    });

    function broadcast(data) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    mqttService.setBroadcast(broadcast);

    wss.on('connection', (ws) => {
        ws.send(JSON.stringify({
            type: 'init',
            devices: deviceService.getDevices()
        }));

        ws.on('message', (message) => {
            const data = JSON.parse(message);

            if (data.type === 'toggle') {
                mqttService.publishCommand(
                    data.uuid,
                    data.action
                );
            }
        });
    });
}

module.exports = initWebsocket;