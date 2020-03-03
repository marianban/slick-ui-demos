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
    console.log(index);
    console.log(items.slice(0, index));
    setItems(items => [...items, ...items.slice(0, index)]);
  };

  useEffect(() => {
    /*
    const newItems = items.length - 7;
    if (newItems) {
      const shiftBy = newItems - 7;
      if (shiftBy) {
        menu.current.style.transform = `translateX(calc(var(--item-width) * ${shiftBy}))`;
      }
    }
    */
  }, [items]);

  return (
    <menu className="menu" ref={menu}>
      {items.map((item, i) => (
        <li
          className="menu-item"
          key={`${item.className}-${i}`}
          onClick={() => selectItem(i)}
        >
          <li className={item.className}></li>
        </li>
      ))}
    </menu>
  );
};
