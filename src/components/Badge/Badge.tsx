import React from 'react';
import classNames from 'classnames';
import './Badge.scss';

type Position = 'right' | 'left';

type Props = {
  children: React.ReactNode,
  text: string,
  warning?: boolean,
  success?: boolean,
  danger?: boolean,
  center?: boolean,
  info?: boolean,
  color?: string,
  backgroundColor?: string,
  position?: Position,
}

const Badge = (props: Props) => {
  const {
    children,
    warning,
    success,
    danger,
    center,
    text,
    info,
    color,
    backgroundColor,
    position = 'right',
  } = props;

  return (
    <div className={classNames('Badge', { 'Badge--center': center })}>
      <If condition={position === 'right'}>
        <div className="Badge__children">{children}</div>
      </If>

      <div
        className={classNames('Badge__item', {
          'Badge__item--info': info,
          'Badge__item--warning': warning,
          'Badge__item--danger': danger,
          'Badge__item--success': success,
          'Badge__item--center': center,
        })}
        style={{ backgroundColor, color }}
      >
        {text}
      </div>

      <If condition={position === 'left'}>
        <div className="Badge__children">{children}</div>
      </If>
    </div>
  );
};

export default React.memo(Badge);
