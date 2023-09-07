CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
	url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Dan Abramov', 'http://www.test.com', 'On let vs const', DEFAULT);
INSERT INTO blogs (author, url, title, likes) VALUES ('Laurenz Albe', 'http://www.test1.com', 'Gaps in sequences in PostgreSQL', DEFAULT);
