import React from 'react';
import Hotkeys from 'react-hot-keys';
import { Storage } from 'types/storage';
import { withStorage } from 'providers/StorageProvider';
import './DebugMode.scss';

type Props = {
  storage: Storage,
  debug: boolean,
}

function DebugMode(props: Props) {
  const {
    debug,
    storage,
  } = props;

  return (
    <>
      <Hotkeys
        keyName="ctrl+shift+d"
        filter={() => true}
        onKeyUp={() => storage.set('debug', !debug)}
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

export default withStorage(['debug'])(DebugMode);
