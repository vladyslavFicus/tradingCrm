import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { SidebarMenuSubItem } from 'config';
import useSidebarNavItem from 'components/Sidebar/hooks/useSidebarNavItem';
import SidebarSubNav from '../SidebarSubNav';
import './SidebarNavItem.scss';

type Props = {
  label: string,
  isSidebarOpen: boolean,
  url?: string,
  icon?: string,
  items?: Array<SidebarMenuSubItem>,
};

const SidebarNavItem = (props: Props) => {
  const {
    label,
    isSidebarOpen,
    icon = '',
    items = [],
    url = '',
  } = props;

  const withSubmenu = !!items.length;

  if (!label || (!url && !withSubmenu)) return null;

  const {
    isOpen,
    setIsOpen,
    isHighlight,
    navItemRef,
  } = useSidebarNavItem({ isSidebarOpen, items });

  return (
    <li
      ref={navItemRef}
      className={classNames('SidebarNavItem', { 'SidebarNavItem--active': isOpen })}
    >
      <Choose>
        <When condition={withSubmenu}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="SidebarNavItem__link"
          >
            <If condition={!!icon}>
              <i
                className={classNames(icon, 'SidebarNavItem__icon', { 'SidebarNavItem__icon--active': isHighlight })}
              />
            </If>

            <span className="SidebarNavItem__label">
              {I18n.t(label)}
            </span>

            <i className="icon-arrow-down SidebarNavItem__arrow" />
          </button>

          <SidebarSubNav
            isOpen={isOpen}
            items={items}
          />
        </When>

        <Otherwise>
          <NavLink
            className={({ isActive }) => classNames(
              'SidebarNavItem__link',
              { 'SidebarNavItem__link--active': isActive },
            )}
            to={url}
          >
            <If condition={!!icon}>
              <i className={classNames(icon, 'SidebarNavItem__icon')} />
            </If>

            <span className="SidebarNavItem__label">
              {I18n.t(label)}
            </span>
          </NavLink>
        </Otherwise>
      </Choose>
    </li>
  );
};

export default React.memo(SidebarNavItem);
