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
            await axios.post('/chat', userData).then(res => {
                res.data ? props.onLogin(userData) : alert('wrong login / password');
                });
        } catch (error) {
            alert('Ой, щось пішло не так ;(');
        }
        props.setIsLoading(false);
    }

    const nextField = (id) => {
        const nextFieldId = document.querySelectorAll('input');
        if (Number(id)===nextFieldId.length) {
            document.querySelector('button').disabled ? nextFieldId[0].focus() : document.querySelector('button').focus();
        } else {
            [...nextFieldId].map((obj) => (
                (obj.id === id)&&(Number(id)<3) && nextFieldId[Number(id)].focus()
            ));
        }
    }

    return (
        <React.Fragment>
            <div className="autorization">
                <input id='1' type="text" maxLength={20} placeholder='Room' onChange={(event) => setRoomName(event.target.value)} onKeyUp={e => (e.key === 'Enter' && nextField(e.target.id))} value={roomName} />
                <input id='2' type="text" placeholder='Password' onChange={(event) => setPassword(event.target.value)} onKeyUp={e => (e.key === 'Enter' && nextField(e.target.id))} value={password} />
                <input id='3' type="text" maxLength={20} placeholder='Your name' onChange={(event) => setUserName(event.target.value)} onKeyUp={e => (e.key === 'Enter' && nextField(e.target.id))} value={userName} />
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
