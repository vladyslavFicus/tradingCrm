import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useSidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sidebarRef = useRef(null);

  const { pathname } = useLocation();

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    setTimeout(close, 200);
  }, [pathname]);

  return {
    isOpen,
    sidebarRef,
    open,
    close,
  };
};

export default useSidebar;
