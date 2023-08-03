import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import I18n from 'i18n-js';
import useTabs from '../hooks/useTabs';
import './Tabs.scss';

type Props = {
  items: Array<{
    label: string,
    url: string,
    permissions?: string,
  }>,
  className?: string,
};

const Tabs = (props: Props) => {
  const {
    items,
    className,
  } = props;

  const { tabs } = useTabs({ items });

  return (
    <div className={classNames('Tabs', className)}>
      {
        tabs.map((tab, key) => (
          <NavLink
            key={key}
            className={({ isActive }) => classNames('Tabs__item', {
              'Tabs__item--active': isActive,
            })}
            to={tab.url}
          >
            {I18n.t(tab.label)}
          </NavLink>
        ))
      }
    </div>
  );
};

export default React.memo(Tabs);
