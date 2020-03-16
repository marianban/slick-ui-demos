import React, { useState } from 'react';
import { v4 } from 'uuid';
import '@fortawesome/fontawesome-free/js/all';
import { Cube } from './Cube';
import './App.scss';
import './Menu';
import { Menu } from './Menu';

const icon = (name, heading) => ({
  className: `fas fa-${name}`,
  id: v4(),
  heading
});

const initialIcons = [
  icon('male', 'Fitness'),
  icon('swimmer', 'Swimming'),
  icon('running', 'Running'),
  icon('skiing', 'Skiing'),
  icon('skating', 'Skating'),
  icon('biking', 'Biking'),
  icon('skiing-nordic', 'Nordic')
];

function App() {
  const [selectedItem, setSelectedItem] = useState(initialIcons[0]);
  const handleMenuItemSelect = item => {
    setSelectedItem(item);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
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
          <Menu
            selected={selectedItem}
            initialIcons={initialIcons}
            onMenuItemSelect={handleMenuItemSelect}
          />
          <h1 className="heading" key={selectedItem.id}>
            {selectedItem.heading}
            <br /> Status
            <svg
              width="120"
              viewBox="0 0 190 160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
                stroke="#fff"
                strokeWidth="15"
                fill="transparent"
              />
            </svg>
          </h1>
        </div>
      </div>
      <div className="app-shadow"></div>
    </div>
  );
}

export default App;
