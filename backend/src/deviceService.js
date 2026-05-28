const db = require('./database');

const devices = {};

function loadDevices(callback) {
    db.all(`SELECT * FROM devices`, [], (err, rows) => {
        rows.forEach(row => {
            devices[row.uuid] = !!row.status;
        });

        callback();
    });
}

function setDevice(uuid, status) {
    devices[uuid] = status;

    db.run(
        `UPDATE devices SET status=? WHERE uuid=?`,
        [status ? 1 : 0, uuid]
    );
}

function getDevices() {
    return Object.entries(devices).map(([uuid, status]) => ({
        uuid,
        status
    }));
}

module.exports = {
    loadDevices,
    setDevice,
    getDevices
};