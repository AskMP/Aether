import express from 'express';
import http from 'http';

let app = express();
let server = http.createServer(app);

app.get('/', (req, res) => {
    res.end('Hello!');
});

server.listen(80);