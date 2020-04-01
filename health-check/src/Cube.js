import React from 'react';
import { isSafari } from './utils';
import './Cube.scss';

export const Cube = ({ style = {}, className = '' }) => (
  <div className={`cube-container ${className}`} style={style}>
    <div className="cube actual">
      <div className="side left"></div>
      <div className="side top"></div>
      <div className="side front"></div>
    </div>
    {!isSafari() && (
      <div className="cube reflection">
        <div className="side left reflection"></div>
        <div className="side top reflection"></div>
        <div className="side front reflection"></div>
      </div>
    )}
  </div>
);
