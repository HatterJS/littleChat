const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

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
            ['users', new Map()],
            ['messages', []]
        ]));
     }
     res.json(rooms);
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

    socket.on('ROOM:NEW_MESSAGE', ({roomName, userName, typeMessage}) => {
        const messageData = {userName, typeMessage};
        console.log(messageData);
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