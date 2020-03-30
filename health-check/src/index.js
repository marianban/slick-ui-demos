import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'web-animations-js';

const isSafari = () => {
  return (
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  );
};

const Main = () => {
  return (
    <>
      {isSafari() && (
        <h1 className="not-supported-browser">
          Webkit is not supported. Please use Chrome or Firefox
        </h1>
      )}
      <App />
    </>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
