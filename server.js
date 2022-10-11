const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

const rooms = new Map();

app.get('/chat', (req, res) => {
    res.json(rooms);
});

app.post('/chat', (req, res) => {
    const { roomName, userName, password } = req.body;
     if (!rooms.has(roomName)) {
        rooms.set(roomName, new Map([
            ['users', new Map()],
            ['messages', []]
        ]));
     }
    console.log(req.body);
    console.log(rooms);
    res.json(rooms);
});

io.on('connection', (socket) => {
    console.log('user connected', socket.id);
});

server.listen(8889, (error) => {
    if (error) {
        throw Error(error);
    }
    console.log('Сервер запущен.');
});