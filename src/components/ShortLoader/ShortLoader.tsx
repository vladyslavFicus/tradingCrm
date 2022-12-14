import React from 'react';
import classNames from 'classnames';
import { ReactComponent as ShortLoaderIcon } from './ShortLoader.svg';
import './ShortLoader.scss';

type Props = {
  height?: number,
  className?: string,
};

const ShortLoader = (props: Props) => {
  const {
    height = 25,
    className,
  } = props;

  return (
    <div className={classNames('ShortLoader', className)}>
      <ShortLoaderIcon height={height} />
    </div>
  );
};

export default React.memo(ShortLoader);
