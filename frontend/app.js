const state = {};
let ws = null;
let reconnectDelayMs = 1000;
let reconnectTimer = null;

const alertBox = document.getElementById("socket-alert");

function showAlert(message, type = "error") {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = message;
    alertBox.classList.remove("hidden", "alert-error", "alert-info", "alert-success");
    alertBox.classList.add(`alert-${type}`);
}

function hideAlert() {
    if (!alertBox) {
        return;
    }

    alertBox.classList.add("hidden");
    alertBox.classList.remove("alert-error", "alert-info", "alert-success");
    alertBox.textContent = "";
}

function scheduleReconnect() {
    if (reconnectTimer) {
        return;
    }

    showAlert("\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c\u0441\u044f \u043a \u0441\u043e\u043a\u0435\u0442\u0443. \u041f\u0440\u043e\u0431\u0443\u0435\u043c \u043f\u0435\u0440\u0435\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c\u0441\u044f...", "info");

    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectWebSocket();
    }, reconnectDelayMs);

    reconnectDelayMs = Math.min(reconnectDelayMs * 2, 10000);
}

function connectWebSocket() {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${protocol}://${location.host}/ws`);

    ws.onopen = () => {
        reconnectDelayMs = 1000;
        showAlert("\u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u0441 \u0441\u043e\u043a\u0435\u0442\u043e\u043c \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043e.", "success");
        setTimeout(hideAlert, 1800);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "init") {
            data.devices.forEach(updateLamp);
        }

        if (data.type === "status") {
            updateLamp(data);
        }
    };

    ws.onclose = () => {
        scheduleReconnect();
    };

    ws.onerror = () => {
        showAlert("\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u044f \u0441 \u0441\u043e\u043a\u0435\u0442\u043e\u043c.", "error");
        ws.close();
    };
}

function updateLamp(device) {
    state[device.uuid] = device.status;

    const lamp = document.getElementById(`lamp-${device.uuid}`);
    const sw = document.getElementById(`switch-${device.uuid}`);

    if (lamp) {
        lamp.classList.toggle("on", Boolean(device.status));
    }

    if (sw) {
        sw.classList.toggle("on", Boolean(device.status));
    }
}

function toggle(uuid) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        showAlert("\u0421\u043e\u043a\u0435\u0442 \u043d\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d. \u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435 \u043f\u0435\u0440\u0435\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f.", "error");
        return;
    }

    ws.send(JSON.stringify({
        type: "toggle",
        uuid,
        action: state[uuid] ? "off" : "on"
    }));
}

connectWebSocket();
