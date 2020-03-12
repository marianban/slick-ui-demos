import React, { useState, useRef, useEffect } from 'react';
import { v4 } from 'uuid';
import classNames from 'classnames';
import './Menu.scss';

export const Menu = props => {
  const it = name => ({ className: `fas fa-${name}`, id: v4() });
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
  const [clicked, setClicked] = useState(0);
  const selectItem = index => {
    const newItems = items.map(v => ({ ...v, id: v4() }));
    setItems(items => [...newItems, ...items.slice(0, index)]);
    setClicked(newItems[index].id);
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
        setClicked(null);
        setItems(items.slice(shiftBy));
      };
    }
  }, [items]);

  return (
    <menu className="menu" ref={menu}>
      {items.map((item, i) => (
        <>
          <li
            className={classNames('menu-item', {
              'menu-item-active': i === 0,
              'menu-item-clicked': clicked === item.id
            })}
            key={`${item.id}`}
            onClick={() => selectItem(i)}
          >
            <i className={item.className}></i>
          </li>
        </>
      ))}
    </menu>
  );
};
