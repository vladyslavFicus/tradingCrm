import React from 'react';
import classNames from 'classnames';
import './TabHeader.scss';

type Props = {
  title: string,
  className?: string,
  children?: React.ReactNode,
};

const TabHeader = (props: Props) => {
  const { title, className, children } = props;

  return (
    <div className={classNames('TabHeader', className, { 'TabHeader--has-content': children })}>
      <div className="TabHeader__title">
        {title}
      </div>

      <If condition={!!children}>
        {children}
      </If>
    </div>
  );
};

export default React.memo(TabHeader);
