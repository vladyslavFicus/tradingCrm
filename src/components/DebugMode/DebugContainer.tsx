import React from 'react';
import { withStorage } from 'providers/StorageProvider';
import './DebugContainer.scss';

type Props = {
  children: React.ReactNode,
  debug: boolean,
}

function DebugMode(props: Props) {
  const {
    children,
    debug = false,
  } = props;

  return (
    <If condition={debug}>
      <div className="DebugContainer">
        {children}
      </div>
    </If>
  );
}

export default React.memo(withStorage(['debug'])(DebugMode));
