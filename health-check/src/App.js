import React, { useState, useRef, useLayoutEffect } from 'react';
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
  icon('swimmer', 'Swim'),
  icon('running', 'Running'),
  icon('skiing', 'Skiing'),
  icon('skating', 'Skating'),
  icon('biking', 'Biking'),
  icon('skiing-nordic', 'Nordic')
];

function App() {
  const [selectedItem, setSelectedItem] = useState(initialIcons[0]);
  const [heading, setHeading] = useState(initialIcons[0].heading);
  const currentRef = useRef();
  const nextRef = useRef();
  const waveBgRef = useRef();
  const handleMenuItemSelect = item => {
    setSelectedItem(item);
  };
  useLayoutEffect(() => {
    const slideTiming = {
      duration: 750,
      easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
    };
    const slideAnimation = [
      { transform: 'translateX(0)' },
      {
        transform: 'translateX(-24rem)'
      }
    ];
    const animation = currentRef.current.animate(slideAnimation, slideTiming);
    nextRef.current.animate(slideAnimation, slideTiming);
    animation.onfinish = () => {
      setHeading(selectedItem.heading);
    };
    const waveBgTiming = {
      duration: 750,
      delay: 100,
      easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
    };
    const waveAnimation = [
      { transform: 'scaleX(1)' },
      { transform: 'scaleX(0)' }
    ];
    waveBgRef.current.animate(waveAnimation, waveBgTiming);
  }, [selectedItem]);

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <div className="app">
          {/* smallest cube */}
          <Cube
            style={{
              '--animation-name': 'animate-height-reverse',
              '--cube-bottom': '90%',
              '--cube-left': '45%',
              '--depth': '8rem',
              '--left-border-left-2': '#E19B98',
              '--left-border-left': '#E19B98',
              '--left-border-right': '#963463',
              '--left-bottom-corner-color': '#89225A',
              '--left-grad-color-from': '#d7beff',
              '--left-grad-color-to': '#F4B4A5',
              '--right-grad-color-1': '#E67AB8',
              '--right-grad-color-from': '#d0b2ff',
              '--right-grad-color-to': '#D7F5F4',
              '--scale-from': 0.04,
              '--scale-to': 1,
              '--size': '8rem',
              '--top-grad-color-to': '#B6E6E0',
              '--top-grad-color-from': '#d0b2ff'
            }}
          />
          {/* medium cube */}
          <Cube
            style={{
              '--animation-name': 'animate-height-reverse',
              '--cube-bottom': '100%',
              '--cube-left': '15%',
              '--depth': '10rem',
              '--front-border-left': '#AFA6ED',
              '--front-border-right': 'black',
              '--front-border-top': '#E2F8FE',
              '--left-border-left-2': '#CBB0F8',
              '--left-border-left': '#904AF2',
              '--left-border-top': '#E2F8FE',
              '--left-grad-color-from': '#d7beff',
              '--left-grad-color-to': '#904AF2',
              '--right-grad-color-from': '#d0b2ff',
              '--right-grad-color-to': '#ACF5FB',
              '--scale-from': 0.04,
              '--scale-to': 1,
              '--size': '10rem',
              '--top-grad-color-to': '#50EDF7',
              '--top-grad-color-from': '#d0b2ff'
            }}
          />
          {/* highest block */}
          <Cube
            style={{
              '--cube-bottom': '75%',
              '--cube-left': '30%',
              '--depth': '8rem',
              '--front-border-left': '#9FB9EE',
              '--left-border-left': '#278874',
              '--left-border-right': '#3B578F',
              '--left-grad-color-from': '#278874',
              '--right-grad-color-1': '#87FCE3',
              '--right-grad-color-from': '#87FCE3',
              '--scale-from': 3,
              '--scale-to': 0.04,
              '--size': '10rem',
              '--top-grad-color-from': '#D1FBF9',
              '--reflection-opacity-from': 1,
              '--reflection-opacity-to': 0.5
            }}
            className="textured"
          />
          {/* medium block */}
          <Cube
            style={{
              '--cube-bottom': '67%',
              '--cube-left': '42%',
              '--depth': '8rem',
              '--front-border-left': '#B29CEE',
              '--left-border-left': '#278874',
              '--left-border-right': '#228099',
              '--left-grad-color-from': '#228099',
              '--right-grad-color-from': '#B2C9F8',
              '--scale-from': 2.5,
              '--scale-to': 0.04,
              '--size': '10rem',
              '--top-grad-color-from': '#B7D2F8',
              '--reflection-opacity-from': 1,
              '--reflection-opacity-to': 0.5
            }}
          />
          {/* smallest block */}
          <Cube
            style={{
              '--cube-left': '25%',
              '--depth': '10rem',
              '--front-border-left': '#BB7BE9',
              '--left-border-left': '#89379C',
              '--left-grad-color-from': '#89379C',
              '--right-grad-color-from': '#EBAFFF',
              '--right-grad-color-to': '#d0b2ff',
              '--scale-from': 2,
              '--scale-to': 0.04,
              '--size': '8rem',
              '--top-grad-color-from': '#D76CEF',
              '--reflection-opacity-from': 1,
              '--reflection-opacity-to': 0.5
            }}
          />
          {/* biggest cube */}
          <Cube
            style={{
              '--animation-name': 'animate-height-reverse',
              '--depth': 'var(--size)',
              '--left-grad-color-from': '#d7beff',
              '--left-grad-color-to': '#e4534c',
              '--right-grad-color-from': '#d0b2ff',
              '--right-grad-color-to': '#ffb8a5',
              '--scale-from': 0.04,
              '--scale-to': 1,
              '--top-grad-color-from': '#d0b2ff',
              '--top-grad-color-to': '#e4534c'
            }}
          />
          <Menu
            selected={selectedItem}
            initialIcons={initialIcons}
            onMenuItemSelect={handleMenuItemSelect}
          />
          <div className="heading-container">
            <div className="heading-item" ref={currentRef}>
              <h1 className="heading">
                {heading}
                <br /> Status
              </h1>
              <div className="wave-container">
                <svg
                  width="150"
                  viewBox="0 0 210 150"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 3 41 Q 32 45 92 70 Q 131 81 155 44 Q 175 27 202 28"
                    stroke="#fff"
                    strokeWidth="15"
                    fill="transparent"
                  />
                </svg>
                <img
                  className="avatar"
                  src="https://i.pravatar.cc/150?img=25"
                  alt="avatar"
                />
              </div>
            </div>
            <div className="heading-item" ref={nextRef}>
              <h1 className="heading">
                {selectedItem.heading}
                <br /> Status
              </h1>
              <div className="wave-container" key={selectedItem.id}>
                <svg
                  width="150"
                  viewBox="0 0 210 150"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 3 41 Q 32 45 92 70 Q 131 81 155 44 Q 175 27 202 28"
                    stroke="#fff"
                    strokeWidth="15"
                    fill="transparent"
                  />
                </svg>
                <img
                  className="avatar"
                  src="https://i.pravatar.cc/150?img=25"
                  alt="avatar"
                />
                <div className="wave-bg" ref={waveBgRef}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="app-shadow"></div>
    </div>
  );
}

export default App;
