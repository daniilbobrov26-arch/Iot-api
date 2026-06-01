const mqtt = require('mqtt');
const deviceService = require('./deviceService');

const client = mqtt.connect({
    host: process.env.MQTT_HOST,
    port: Number(process.env.MQTT_PORT),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 2000,
    keepalive: 30
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

client.on('error', (error) => {
    console.error('MQTT connection error', error);
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
