const { createServer } = require('http');
const { parse } = require('url');
const { v4: uuidv4 } = require('uuid');

let users = [];

const server = createServer((req, res) => {
    const { pathname, query } = parse(req.url, true);
    const method = req.method.toUpperCase();

    res.setHeader('Content-Type', 'application/json');

    // GET /users - Get all users
    if (method === 'GET' && pathname === '/users') {
        res.writeHead(200);
        res.end(JSON.stringify(users));
        return;
    }

    // GET /users/:id - Get a user by ID
    if (method === 'GET' && pathname.startsWith('/users/')) {
        const id = pathname.split('/')[2];
        const user = users.find(u => u.id === id);

        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'User not found' }));
        }
        return;
    }

    // POST /users - Create a new user
    if (method === 'POST' && pathname === '/users') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email } = JSON.parse(body);
            const newUser = { id: uuidv4(), name, email };
            users.push(newUser);
            res.writeHead(201);
            res.end(JSON.stringify(newUser));
        });
        return;
    }

    // PUT /users/:id - Update a user by ID
    if (method === 'PUT' && pathname.startsWith('/users/')) {
        const id = pathname.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email } = JSON.parse(body);
            const userIndex = users.findIndex(u => u.id === id);

            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], name, email };
                res.writeHead(200);
                res.end(JSON.stringify(users[userIndex]));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        });
        return;
    }

    // DELETE /users/:id - Delete a user by ID
    if (method === 'DELETE' && pathname.startsWith('/users/')) {
        const id = pathname.split('/')[2];
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            res.writeHead(204);
            res.end();
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'User not found' }));
        }
        return;
    }

    // Handle 404 Not Found
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
});

module.exports = (req, res) => {
    server.emit('request', req, res);
};
