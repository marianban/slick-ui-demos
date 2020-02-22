import React from 'react';
import { Cube } from './Cube';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Cube
        style={{
          '--cube-left': '25%',
          '--scale-from': 3,
          '--scale-to': 0.04,
          '--size': '8rem',
          '--depth': '8rem'
        }}
      />
      <Cube />
    </div>
  );
}

export default App;
