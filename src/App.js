import React from 'react';
import axios from 'axios';
import './css/App.css';

import socket from './socket';
import reducer from './components/reducer';

import Header from './components/Header';
import Autorization from './components/Autorization';
import Chat from './components/Chat/Chat';
import Loader from './components/Loader/Loader';
import Footer from './components/Footer';

function App() {

  const [state, dispatch] = React.useReducer(reducer, {
    isAuthorization: false,
    roomName: null,
    password: null,
    userName: null,
    users: [],
    messageData: []
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onLogin = (userData) => {
    dispatch({
      type: 'IS_AUTORIZATION',
      payload: userData
    });
    socket.emit('ROOM:JOIN', userData);
    axios.get(`/chat/${userData.roomName}`).then(res => setUsers(res.data.users));
    axios.get(`/chat/${userData.roomName}`).then(res =>
      dispatch({
        type: 'SET_OLD_MESSAGES',
        payload: res.data.messages
      })
    );
  }

  function setUsers(users) {
    dispatch({
      type: 'SET_USERS',
      payload: users
    });
  }

  function addMessage(messageData) {
    dispatch({
      type: 'SET_MESSAGES',
      payload: messageData
    });
  }

  React.useEffect(() => {
    socket.on('ROOM:USERS', (users) => {
      setUsers(users);
    });
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  return (
    <React.Fragment>
      <div className="wrapper">
        <Header />
        {!isLoading ?
          <div className="content">
            {!state.isAuthorization ? <Autorization 
              onLogin = {(userData) => onLogin(userData)}
              setIsLoading = {(value) => setIsLoading(value)}
            /> :
            <Chat 
              roomName = {state.roomName}
              userName = {state.userName}
              users = {state.users}
              messageData = {state.messageData}
              addMessage = {addMessage}
            />}
          </div> :
          <Loader />
        }
        <Footer />
      </div>
    </React.Fragment>
  );
}

export default App;
