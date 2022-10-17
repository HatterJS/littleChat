import io from 'socket.io-client';

const socket = io.connect('http://185.237.204.125:8889', { transports : ['websocket', 'polling', 'flashsocket'] });

export default socket;