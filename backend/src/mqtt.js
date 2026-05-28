const mqtt = require('mqtt');
const deviceService = require('./deviceService');

const client = mqtt.connect({
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT
});

let wsBroadcast = null;

client.on('connect', () => {
    client.subscribe('iot/devices/status');
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());

    deviceService.setDevice(data.uuid, data.status);

    if (wsBroadcast) {
        wsBroadcast({
            type: 'status',
            uuid: data.uuid,
            status: data.status
        });
    }
});

function publishCommand(uuid, action) {
    client.publish(
        'iot/devices/commands',
        JSON.stringify({ uuid, action })
    );
}

function setBroadcast(fn) {
    wsBroadcast = fn;
}

module.exports = {
    publishCommand,
    setBroadcast
};