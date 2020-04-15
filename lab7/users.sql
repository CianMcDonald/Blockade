DROP TABLE IF EXISTS users;
CREATE TABLE users(
    username VARCHAR(20) NOT NULL,
    password VARCHAR(64) NOT NULL,
    pong_score INTEGER,
    flappybird_score INTEGER,
    PRIMARY KEY(username)
);
