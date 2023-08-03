import React, { useCallback } from 'react';

type EventClick = (e: React.MouseEvent<HTMLAnchorElement>) => void

const useLink = (onClick: EventClick) => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>): void => {
    const { href, target } = e.target as HTMLAnchorElement;

    e.stopPropagation();

    if (e.ctrlKey || e.metaKey || target === '_blank') {
      window.open(href);

      e.preventDefault();
    }

    if (onClick) onClick(e);
  }, [onClick]);

  return {
    handleClick,
  };
};

export default useLink;
