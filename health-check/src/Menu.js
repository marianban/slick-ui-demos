import React from 'react';
import './Menu.scss';

export const Menu = props => {
  const length = 7;
  const it = name => ({ className: `fas fa-${name}` });
  const items = [
    it('male'),
    it('swimmer'),
    it('running'),
    it('skiing'),
    it('skating'),
    it('biking'),
    it('skiing-nordic')
  ];

  return (
    <menu className="menu">
      {items.map(item => (
        <li className="menu-item">
          <li className={item.className}></li>
        </li>
      ))}
      {/* <li className="menu-item">
        <div className="menu-item-active">
          <i class="fas fa-skiing-nordic"></i>
        </div>
      </li> */}
    </menu>
  );
};
