import React from 'react';
import Hotkeys from 'react-hot-keys';
import useDebugMode from './hooks/useDebugMode';
import './DebugMode.scss';

function DebugMode() {
  const { debug, setDebug } = useDebugMode();

  return (
    <>
      <Hotkeys
        keyName="ctrl+shift+d"
        filter={() => true}
        onKeyUp={() => setDebug(!debug)}
      />

      <If condition={debug}>
        <div className="DebugMode DebugMode--left">
          === DEBUG MODE ===
        </div>
        <div className="DebugMode DebugMode--right">
          === DEBUG MODE ===
        </div>
      </If>
    </>
  );
}

export default React.memo(DebugMode);
