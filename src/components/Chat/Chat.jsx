import React from "react";
import './chat.css'

import socket from "../../socket";

const sendMessageSVG = <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
    <path d="M9.5 13L1 9.00001L21.5 1.00001M9.5 13L21.5 1.00001M9.5 13L13.5 21.5L21.5 1.00001" stroke="#646464" strokeWidth="1.5" strokeLinejoin="round"/>
</svg>

function Chat({roomName, userName, users, messageData, addMessage, password}) {

    const [typeMessage, setTypeMessage] = React.useState("");

    //плавная прокрутка скролла вниз при переполненни окна сообщений
    const messagesEndRef = React.useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    React.useEffect(() => {
        scrollToBottom();
    }, [messageData]);

    function sendMessage() {
        const currentDate = new Date();
        const currentTime = currentDate.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        console.log(currentTime);
        const messageData = {
            roomName,
            userName,
            typeMessage,
            currentTime
        };
        socket.emit('ROOM:NEW_MESSAGE', messageData);
        setTypeMessage('');
        addMessage(messageData);
    }

    return (
        <React.Fragment>
            <div className="chat">
                <div className="chat__usersPanel">
                    <h4>{userName}</h4>
                    <div className="chat__usersFrame unselectable">
                        <div className="chat__innerFrame">
                            <p>{`Online (${users.length})`}</p>
                            {users.map((user, index) => <div className="chat__userItem" key={index}>
                                <img src="./img/userAvatar.png" alt="" />
                                <p>{user}</p>
                            </div>)}
                        </div>
                    </div>
                </div>
                <div className="chat__messageBlock">
                    <h4>Room: {roomName}</h4>
                    <div className="chat__chatFrame">
                        <div className="chat__innerFrame">
                            <p>password: {password}</p>
                            {messageData.map((message, index) => <div className={message.userName===userName ? "chat__myMessages" : "chat__usersMesages"} key={index}>
                                <div className="chat__headOfMessage">
                                    <h5 className="unselectable">{message.userName}</h5>
                                    <p className="unselectable">{message.currentTime}</p>
                                </div>
                                <p>{message.typeMessage}</p>
                            </div>)}
                            <div ref={messagesEndRef} style={{visibility: 'hidden'}}/>
                        </div>
                    </div>
                    <div className="chat__writtingBlock">
                        <textarea
                            rows="1"
                            value={typeMessage}
                            onChange={event => setTypeMessage(event.target.value)}
                            onKeyUp={event => (event.key === 'Enter' ? sendMessage() : null)}
                        />
                        <button className="unselectable" onClick={sendMessage}>{sendMessageSVG}</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Chat;