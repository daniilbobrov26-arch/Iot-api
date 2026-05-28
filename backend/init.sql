CREATE TABLE IF NOT EXISTS devices (
    uuid TEXT PRIMARY KEY,
    status INTEGER NOT NULL
);

INSERT OR IGNORE INTO devices(uuid, status)
VALUES
('relay-1', 0),
('relay-2', 0);