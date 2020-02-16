import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="app">
      <div className="cube">
        <div className="side back">back</div>
        <div className="side left">left</div>
        <div className="side right">right</div>
        <div className="side top">top</div>
        <div className="side bottom">bottom</div>
        <div className="side front">front</div>
      </div>
      <div className="cube-reflection">
        <div className="cube">
          <div className="side back">back</div>
          <div className="side left">left</div>
          <div className="side right">right</div>
          <div className="side top">top</div>
          <div className="side bottom">bottom</div>
          <div className="side front">front</div>
        </div>
      </div>
    </div>
  );
}

export default App;
