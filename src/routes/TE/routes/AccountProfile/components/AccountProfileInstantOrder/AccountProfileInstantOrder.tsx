import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Hotkeys from 'react-hot-keys';
import { Rnd } from 'react-rnd';
import permissions from 'config/permissions';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import PermissionContent from 'components/PermissionContent';
import GeneralNewOrderForm from 'routes/TE/forms/GeneralNewOrderForm';
import { ReactComponent as InstantIcon } from './img/instant.svg';
import './AccountProfileInstantOrder.scss';

type Props = {
  accountUuid: string
};

const AccountProfileInstantOrder = (props: Props) => {
  const { accountUuid } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  // Set initial window position when content rendered
  useEffect(() => {
    const width = windowRef.current?.offsetWidth || 0;
    const height = windowRef.current?.offsetHeight || 0;

    setPosition({
      x: window.innerWidth - (width + 120),
      y: window.innerHeight - (height + 110),
    });
  }, [windowRef]);

  // ===== Handlers ===== //
  const onSuccess = () => {
    EventEmitter.emit(ORDER_RELOAD);

    setIsOpen(false);
  };

  return (
    <PermissionContent permissions={permissions.WE_TRADING.CREATE_ORDER}>
      <div className="AccountProfileInstantOrder">
        {/* Open/close instant order window by SHIFT+A hot key */}
        <Hotkeys keyName="ctrl+x" filter={() => true} onKeyUp={() => setIsOpen(!isOpen)} />

        <If condition={!isOpen}>
          <div className="AccountProfileInstantOrder__open-button" onClick={() => setIsOpen(true)}>
            <InstantIcon />
          </div>
        </If>
        <Rnd
          bounds="body"
          enableUserSelectHack={false}
          enableResizing={false}
          position={position}
          style={{ position: 'fixed', inset: 'unset', zIndex: isOpen ? 10 : -1 }}
          dragHandleClassName="AccountProfileInstantOrder__window-header"
          onDragStop={(e, d) => {
            setPosition({ x: d.x, y: d.y });
          }}
        >
          <div
            ref={windowRef}
            className={classNames('AccountProfileInstantOrder__window', {
              'AccountProfileInstantOrder__window--open': isOpen,
            })}
          >
            <div className="AccountProfileInstantOrder__window-header">
              <div>New order</div>
              <div
                className="AccountProfileInstantOrder__window-header-close-button"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </div>
            </div>
            <div className="AccountProfileInstantOrder__window-content">
              <GeneralNewOrderForm
                accountUuid={accountUuid}
                hotKeysEnabled={isOpen}
                onSuccess={onSuccess}
              />
            </div>
          </div>
        </Rnd>
      </div>
    </PermissionContent>
  );
};

export default React.memo(AccountProfileInstantOrder);
