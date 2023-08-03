import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarMenuSubItem } from 'config/menu';

type Props = {
  isSidebarOpen: boolean,
  items?: Array<SidebarMenuSubItem>,
};

const useSidebarNavItem = (props: Props) => {
  const {
    isSidebarOpen,
    items = [],
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHighlight, setIsHighlight] = useState<boolean>(false);
  const navItemRef = useRef(null);

  const { pathname } = useLocation();

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const isCurrentPathName = useMemo(() => items.some(({ url: urlItem }) => urlItem && urlItem === pathname),
    [items, pathname]);

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

  return {
    isOpen,
    setIsOpen,
    isHighlight,
    navItemRef,
  };
};

export default useSidebarNavItem;
