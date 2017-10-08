CREATE TABLE IF NOT EXISTS  thread (
  id integer PRIMARY KEY,
  uri TEXT not null unique,
  title TEXT
);

CREATE TABLE IF NOT EXISTS comment (
  id INTEGER PRIMARY KEY,
  tid REFERENCES thread(id),
  path TEXT,
  body TEXT,
  remote_addr VARCHAR(45),
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  created datetime NOT NULL,
  modified datetime NOT NULL,
  depth int not null default 0,
  parent int,
  author VARCHAR,
  email VARCHAR,
  website VARCHAR,
  voters BLOB
);
