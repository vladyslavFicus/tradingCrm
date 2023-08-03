import React from 'react';
import useDebugContainer from '../hooks/useDebugContainer';
import './DebugContainer.scss';

type Props = {
  children: React.ReactNode,
};

function DebugMode(props: Props) {
  const { debug } = useDebugContainer();

  return (
    <If condition={debug}>
      <div className="DebugContainer">
        {props.children}
      </div>
    </If>
  );
}

export default React.memo(DebugMode);
