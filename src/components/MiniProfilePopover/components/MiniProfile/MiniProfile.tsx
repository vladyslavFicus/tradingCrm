import React from 'react';
import classNames from 'classnames';
import { Statuses } from '../../types';
import './MiniProfile.scss';

type Props = {
  className: string,
  status?: Statuses,
  children: React.ReactNode,
}

const MiniProfile = (props: Props) => {
  const { className, status, children } = props;

  return (
    <div className={classNames('MiniProfile', className, status)}>
      {children}
    </div>
  );
};

export default React.memo(MiniProfile);
