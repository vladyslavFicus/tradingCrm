import React from 'react';
import classNames from 'classnames';
import { LevelType } from '../../types';
import './Notification.scss';

type Props = {
  level: LevelType,
  title: string,
  message: string,
};

const Notification = (props: Props) => (
  <div className={classNames('Notification', `Notification--${props.level}`)}>
    <div className="Notification__title">{props.title}</div>
    <div>{props.message}</div>
  </div>
);

export default React.memo(Notification);
