import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import classNames from 'classnames';
import './Menu.scss';

export const Menu = props => {
  const { onMenuItemSelect, initialIcons, selected } = props;
  const numberOfIcons = initialIcons.length;
  const [icons, setIcons] = useState(initialIcons);
  const [clicked, setClicked] = useState(null);
  const menu = useRef();
  const selectItem = index => {
    const enteringIcons = icons.slice(0, index).map(v => ({ ...v, id: v4() }));
    setIcons(items => [...icons, ...enteringIcons]);
    onMenuItemSelect(icons[index]);
    setClicked(icons[index].id);
  };

  useEffect(() => {
    if (icons.length !== numberOfIcons) {
      const shiftBy = icons.length - numberOfIcons;
      const slideTiming = {
        duration: 750,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
      };
      const slideAnimation = [
        { transform: 'translateX(0)' },
        {
          transform: `translateX(calc(var(--item-width) * ${shiftBy}))`
        }
      ];
      const animation = menu.current.animate(slideAnimation, slideTiming);
      animation.onfinish = () => {
        setClicked(null);
        setIcons(icons.slice(shiftBy));
      };
    }
  }, [icons, numberOfIcons]);

  return (
    <menu
      className={classNames('menu', { 'menu-animating': clicked !== null })}
      ref={menu}
    >
      {icons.map((item, i) => (
        <li
          className={classNames('menu-item', {
            'menu-item-active': selected.id === item.id,
            'menu-item-clicked': clicked === item.id
          })}
          key={`${item.id}`}
          onClick={() => selectItem(i)}
        >
          <item.Icon />
        </li>
      ))}
    </menu>
  );
};

Menu.propTypes = {
  initialIcons: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.object.isRequired
};
