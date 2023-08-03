import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import './BackToTop.scss';

type Props = {
  position: string,
};

const BackToTop = (props: Props) => {
  const { position } = props;

  const [isVisible, setIsVisible] = useState(false);

  /**
   * Scroll page to top
   */
  const scrollToTop = useCallback(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  // Check if scroll position more than height of client viewport
  useEffect(() => {
    const handleScroll = () => {
      if (
        document.documentElement.scrollTop > document.documentElement.clientHeight
        || document.body.scrollTop > document.body.clientHeight
      ) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={classNames(
        `BackToTop fa fa-caret-up BackToTop--sidebar-position-${position}`,
        { 'BackToTop--visible': isVisible },
      )}
      onClick={scrollToTop}
    />
  );
};

export default BackToTop;
