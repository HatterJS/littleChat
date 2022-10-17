const express = require('express');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

app.use(cors({
    origin: "http://mypage.energodar.top",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

const rooms = new Map();

app.get('/chat/:id', (req, res) => {
    const roomName = req.params.id;
    const data = rooms.has(roomName) ? {
        users: [...rooms.get(roomName).get('users').values()],
        messages: [...rooms.get(roomName).get('messages').values()]
    } : {users: [], messages: []};
    res.json(data);
});

app.post('/chat', (req, res) => {
    const { roomName, password, userName } = req.body;
     if (!rooms.has(roomName)) {
        rooms.set(roomName, new Map([
            ['password', password],
            ['users', new Map()],
            ['messages', []]
        ]));
        res.json('room built');
     } else {
        rooms.get(roomName).get('password')===password ? res.json(true) :  res.json(false);
     }
});

io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', (userData) => {
        socket.join(userData.roomName);
        rooms.get(userData.roomName).get('users').set(socket.id, userData.userName);
        const users = [...rooms.get(userData.roomName).get('users').values()];
        socket.to(userData.roomName).emit('ROOM:USERS', users);
    });

    socket.on('disconnect', () => {
        rooms.forEach((value, roomName) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.to(roomName).emit('ROOM:USERS', users);
            }
        });
    });

    socket.on('ROOM:NEW_MESSAGE', ({roomName, userName, typeMessage, currentTime}) => {
        const messageData = {userName, typeMessage, currentTime};
        rooms.get(roomName).get('messages').push(messageData);
        socket.to(roomName).emit('ROOM:NEW_MESSAGE', messageData);
    });

    console.log('user connected', socket.id);
});

server.listen(8889, (error) => {
    if (error) {
        throw Error(error);
    }
    console.log('Сервер запущен.');
});