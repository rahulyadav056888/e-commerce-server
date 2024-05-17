const { createServer } = require('http');

const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello, world!' }));
});

module.exports = (req, res) => {
    server.emit('request', req, res);
};
