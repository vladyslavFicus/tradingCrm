import React from 'react';
import I18n from 'i18n-js';
import { NavLink } from 'components/Link';
import './SubNavItem.scss';

type Props = {
  label: string,
  url: string,
};

const SubNavItem = (props: Props) => {
  const { label, url } = props;

  return (
    <NavLink className="SubNavItem" activeClassName="SubNavItem SubNavItem--active" to={url}>
      <i className="icon-arrow-down SubNavItem__icon" />

      {I18n.t(label)}
    </NavLink>
  );
};

export default React.memo(SubNavItem);
