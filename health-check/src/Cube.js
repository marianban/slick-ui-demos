import React from 'react';
import './Cube.scss';

export const Cube = ({ style = {} }) => (
  <div className="cube-container" style={style}>
    <div className="cube actual">
      <div className="side back">back</div>
      <div className="side left">left</div>
      <div className="side right">right</div>
      <div className="side top">top</div>
      <div className="side bottom">bottom</div>
      <div className="side front">front</div>
    </div>

    <div className="cube reflection">
      <div className="side back reflection">back</div>
      <div className="side left reflection">left</div>
      <div className="side right reflection">right</div>
      <div className="side top reflection">top</div>
      <div className="side bottom reflection">bottom</div>
      <div className="side front reflection">front</div>
    </div>
  </div>
);
