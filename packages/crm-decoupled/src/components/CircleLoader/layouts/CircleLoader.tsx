import React from 'react';
import classNames from 'classnames';
import './CircleLoader.scss';

type Props = {
  size?: number,
  color?: string,
  overlayColor?: string,
  className?: string,
}

const CircleLoader = (props: Props) => {
  const {
    size = 20,
    color = 'var(--accent)',
    overlayColor = 'var(--divider)',
    className,
  } = props;

  const style = {
    width: size,
    height: size,
    border: `${size / 9}px solid ${overlayColor}`,
    borderTop: `${size / 9}px solid ${color}`,
  };

  return <div data-testid="CircleLoader" className={classNames('CircleLoader', className)} style={style} />;
};

export default React.memo(CircleLoader);
