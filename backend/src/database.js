const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.SQLITE_PATH);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS devices (
            uuid TEXT PRIMARY KEY,
            status INTEGER NOT NULL
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO devices(uuid, status)
        VALUES ('relay-1', 0), ('relay-2', 0)
    `);
});

module.exports = db;