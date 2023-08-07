import React from 'react';
import classNames from 'classnames';
import Scrollbars from 'react-custom-scrollbars';
import { sidebarBottomMenu, sidebarTopMenu } from 'config';
import useSidebar from '../hooks/useSidebar';
import SidebarNav from './components/SidebarNav';
import './Sidebar.scss';

type Props = {
  position: string,
};

const Sidebar = (props: Props) => {
  const { position } = props;

  const {
    isOpen,
    sidebarRef,
    open,
    close,
  } = useSidebar();

  return (
    <aside
      ref={sidebarRef}
      className={classNames(`Sidebar Sidebar--${position}`, { 'Sidebar--open': isOpen })}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <Scrollbars
        className="Scrollbars"
        renderView={(propsScrollbar: any) => <div {...propsScrollbar} className="ScrollbarContainer" />}
        renderThumbVertical={(propsScrollbar: any) => <div {...propsScrollbar} className="ThumbVertical" />}
        style={{ height: 'calc(100% - 48px)' }}
      >
        <SidebarNav
          isSidebarOpen={isOpen}
          items={sidebarTopMenu}
        />
      </Scrollbars>

      <SidebarNav
        isSidebarOpen={isOpen}
        items={sidebarBottomMenu}
      />
    </aside>
  );
};

export default React.memo(Sidebar);
