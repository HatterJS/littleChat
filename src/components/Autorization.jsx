import axios from 'axios';
import React from 'react';

function Autorization(props) {

    const [roomName, setRoomName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userName, setUserName] = React.useState("");

    const userData = {
        roomName,
        password,
        userName
    }

    async function enter() {
        props.setIsLoading(true);
        try {
            await axios.post('/chat', userData).then(props.onLogin(userData));
        } catch (error) {
            alert('Ой, щось пішло не так ;(');
        }
        props.setIsLoading(false);
    }

    return (
        <React.Fragment>
            <div className="autorization">
                <input type="text" placeholder='Room id' onChange={(event) => setRoomName(event.target.value)} value={roomName} />
                <input type="text" placeholder='Password' onChange={(event) => setPassword(event.target.value)} value={password} />
                <input type="text" placeholder='Your name' onChange={(event) => setUserName(event.target.value)} value={userName} />
                <button
                    className='unselectable'
                    onClick={enter}
                    disabled={!roomName||!password||!userName ? true : false}
                >CONNECT
                </button>
            </div>
        </React.Fragment>
    );
}

export default Autorization;
