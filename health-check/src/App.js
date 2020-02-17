import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="app">
      <div className="cube-container">
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
            <div className="side back reflection">back</div>
            <div className="side left reflection">left</div>
            <div className="side right reflection">right</div>
            <div className="side top reflection">top</div>
            <div className="side bottom reflection">bottom</div>
            <div className="side front reflection">front</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
