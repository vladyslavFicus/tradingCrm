import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { SidebarMenuSubItem } from 'config/menu';
import { NavLink } from 'components/Link';
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

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHighlight, setIsHighlight] = useState<boolean>(false);
  const navItemRef = useRef(null);

  const { pathname } = useLocation();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const isCurrentPathName = items.some(({ url: urlItem }) => urlItem && urlItem === pathname);

  useEffect(() => {
    if (isCurrentPathName) {
      setIsHighlight(true);
    }
  }, []);

  useEffect(() => {
    // Check if sidebar was opened and now stay opened and location includes current item url --> open sub menu
    if (isSidebarOpen && isCurrentPathName) {
      handleOpen();
      setIsHighlight(true);
    }

    if (!isSidebarOpen) {
      handleClose();

      if (!isCurrentPathName) {
        setIsHighlight(false);
      }
    }
  }, [isSidebarOpen, pathname]);

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
            className="SidebarNavItem__link"
            activeClassName="SidebarNavItem__link--active"
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
