import React from 'react';
import './css/App.css';
import './css/loader.css';

import socket from './socket';
import reducer from './components/reducer';
import Autorization from './components/Autorization';

function App() {

  const [state, dispatch] = React.useReducer(reducer, {isAuthorization: false});

  const [isLoading, setIsLoading] = React.useState(false);

  const onLogin = () => {
    dispatch({
      type: 'IS_AUTORIZATION',
      payload: true
    });
  }

  console.log(isLoading);

  return (
    <React.Fragment>
      <div className="wrapper">
        {!isLoading ?
          <div className="content">
            {!state.isAuthorization && <Autorization 
              onLogin = {onLogin}
              setIsLoading = {(value) => setIsLoading(value)}
            />}
          </div> :
          <div className="loader02">
              <div className="border02">
                  <div className="shapeEye01"></div>
                  <div className="shapeEye02"></div>
              </div>
              <p>loading...</p>
          </div>
        }
      </div>
    </React.Fragment>
  );
}

export default App;
