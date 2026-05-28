const ws = new WebSocket(`ws://${location.host}/ws`);

const state = {};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'init') {
        data.devices.forEach(updateLamp);
    }

    if (data.type === 'status') {
        updateLamp(data);
    }
};

function updateLamp(device) {
    state[device.uuid] = device.status;

    const lamp = document.getElementById(`lamp-${device.uuid}`);

    if (device.status) {
        lamp.classList.add('on');
    } else {
        lamp.classList.remove('on');
    }
}

function toggle(uuid) {
    ws.send(JSON.stringify({
        type: 'toggle',
        uuid,
        action: state[uuid] ? 'off' : 'on'
    }));
}