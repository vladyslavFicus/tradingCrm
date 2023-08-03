import { useRef } from 'react';

const useSidebarSubNav = (isOpen: boolean) => {
  const subNavRef = useRef(null);

  const scrollHeight = (subNavRef?.current as HTMLDivElement | null)?.scrollHeight;

  const height = isOpen && scrollHeight ? scrollHeight : 0;

  return {
    subNavRef,
    height,
  };
};

export default useSidebarSubNav;
