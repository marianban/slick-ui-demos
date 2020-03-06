import React, { useState, useRef, useEffect } from 'react';
import './Menu.scss';

export const Menu = props => {
  const it = name => ({ className: `fas fa-${name}` });
  const [items, setItems] = useState([
    it('male'),
    it('swimmer'),
    it('running'),
    it('skiing'),
    it('skating'),
    it('biking'),
    it('skiing-nordic')
  ]);
  const menu = useRef();
  const selectItem = index => {
    setItems(items => [...items, ...items.slice(0, index)]);
  };

  useEffect(() => {
    if (items.length !== 7) {
      const shiftBy = items.length - 7;
      const slideTiming = {
        duration: 500,
        easing: 'ease-in-out'
      };
      const slideAnimation = [
        { transform: 'translateX(0)' },
        {
          transform: `translateX(calc(var(--item-width) * ${shiftBy}))`
        }
      ];
      const animation = menu.current.animate(slideAnimation, slideTiming);

      animation.onfinish = function() {
        setItems(items.slice(shiftBy));
      };
    }
  }, [items]);

  return (
    <menu className="menu" ref={menu}>
      {items.map((item, i) => (
        <>
          <li
            className="menu-item"
            key={`${item.className}-${i}`}
            onClick={() => selectItem(i)}
          >
            <li className={item.className}></li>
          </li>
          <li className="menu-item-active"></li>
        </>
      ))}
    </menu>
  );
};
