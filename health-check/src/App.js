import React from 'react';
import '@fortawesome/fontawesome-free/js/all';
import { Cube } from './Cube';
import './App.scss';
import './Menu';
import { Menu } from './Menu';

function App() {
  // #8FF9F6
  return (
    <div className="app">
      <Cube
        style={{
          '--cube-left': '45%',
          '--cube-bottom': '90%',
          '--scale-from': 0.04,
          '--scale-to': 1,
          '--size': '8rem',
          '--depth': '8rem',
          '--top-grad-color-2': '#B6E6E0',
          '--right-grad-color-1': '#E67AB8',
          '--right-grad-color-2': '#D7F5F4',
          '--left-grad-color-1': '#89225A',
          '--left-grad-color-2': '#F4B4A5',
          '--left-border-right': '#963463',
          '--animation-name': 'animate-height-reverse'
        }}
      />
      <Cube
        style={{
          '--cube-left': '15%',
          '--cube-bottom': '100%',
          '--scale-from': 0.04,
          '--scale-to': 1,
          '--size': '10rem',
          '--depth': '10rem',
          '--top-grad-color-2': '#50EDF7',
          '--right-grad-color-2': '#ACF5FB',
          '--left-grad-color-2': '#904AF2',
          // '--left-border-left': '#904AF2',
          '--left-border-left': '#904AF2',
          '--left-border-left-2': '#CBB0F8',
          '--front-border-left': '#AFA6ED',
          '--front-border-right': 'black',
          '--front-border-top': '#E2F8FE',
          '--left-border-top': '#E2F8FE',
          '--animation-name': 'animate-height-reverse'
        }}
      />
      <Cube
        style={{
          '--cube-left': '30%',
          '--cube-bottom': '75%',
          '--scale-from': 3,
          '--scale-to': 0.04,
          '--size': '10rem',
          '--depth': '8rem',
          '--top-grad-color-2': '#8FF9F6',
          '--right-grad-color-2': '#8FF9F6',
          '--left-grad-color-2': '#278874',
          '--left-border-left': '#278874',
          '--left-border-right': '#3B578F',
          '--front-border-left': '#9FB9EE'
        }}
      />
      <Cube
        style={{
          '--cube-left': '45%',
          '--scale-from': 2,
          '--scale-to': 0.04,
          '--size': '10rem',
          '--depth': '8rem',
          '--top-grad-color-2': '#B7D2F8',
          '--right-grad-color-2': '#B2C9F8',
          '--left-grad-color-2': '#228099',
          '--left-border-left': '#278874',
          '--left-border-right': '#228099',
          '--front-border-left': '#B29CEE'
        }}
      />
      <Cube
        style={{
          '--cube-left': '25%',
          '--scale-from': 2,
          '--scale-to': 0.04,
          '--size': '8rem',
          '--depth': '10rem',
          '--top-grad-color-2': '#D76CEF',
          '--right-grad-color-2': '#EBAFFF',
          '--left-grad-color-2': '#89379C',
          '--left-border-left': '#89379C',
          '--front-border-left': '#BB7BE9'
        }}
      />
      <Cube
        style={{
          '--scale-from': 0.04,
          '--scale-to': 1,
          '--depth': 'var(--size)',
          '--animation-name': 'animate-height-reverse'
        }}
      />
      <Menu />
    </div>
  );
}

export default App;
