import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import I18n from 'i18n-js';
import './SubNavItem.scss';

type Props = {
  label: string,
  url: string,
};

const SubNavItem = (props: Props) => {
  const { label, url } = props;

  return (
    <NavLink
      className={({ isActive }) => classNames('SubNavItem', { 'SubNavItem--active': isActive })}
      to={url}
    >
      <i className="icon-arrow-down SubNavItem__icon" />

      {I18n.t(label)}
    </NavLink>
  );
};

export default React.memo(SubNavItem);
