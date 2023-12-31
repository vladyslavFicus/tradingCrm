import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Hotkeys from 'react-hot-keys';
import { Rnd } from 'react-rnd';
import { Config, Utils, usePermission } from '@crm/common';
import SymbolChart from 'components/SymbolChart';
import GeneralNewOrderForm from 'routes/TE/forms/GeneralNewOrderForm';
import { ReactComponent as InstantIcon } from './img/instant.svg';
import './AccountProfileInstantOrder.scss';

type Props = {
  accountUuid: string,
};

const AccountProfileInstantOrder = (props: Props) => {
  const { accountUuid } = props;

  const [symbol, setSymbol] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const permission = usePermission();

  const windowRef = useRef<HTMLDivElement>(null);

  // Set initial window position when content rendered
  useEffect(() => {
    const width = windowRef.current?.offsetWidth || 0;
    const height = windowRef.current?.offsetHeight || 0;

    setPosition({
      x: window.innerWidth - (width + 120),
      y: window.innerHeight - (height + 110),
    });

    setSize({ width, height });
  }, [windowRef]);

  // ===== Handlers ===== //
  const onSuccess = () => {
    Utils.EventEmitter.emit(Utils.ORDER_RELOAD);

    setIsOpen(false);
  };

  return (
    <If condition={permission.allows(Config.permissions.WE_TRADING.CREATE_ORDER)}>
      <div className="AccountProfileInstantOrder">
        {/* Open/close instant order window by CTRL+X hot key */}
        <Hotkeys keyName="ctrl+x" filter={() => true} onKeyUp={() => setIsOpen(!isOpen)} />

        <If condition={!isOpen}>
          <div className="AccountProfileInstantOrder__open-button" onClick={() => setIsOpen(true)}>
            <InstantIcon />
          </div>
        </If>

        {/* Special drag container to drag window by it bounds */}
        <div className="AccountProfileInstantOrder__drag-container" />

        <Rnd
          bounds=".AccountProfileInstantOrder__drag-container"
          enableUserSelectHack={false}
          enableResizing={false}
          position={position}
          style={{ position: 'fixed', inset: 'unset', zIndex: isOpen ? 600 : -1 }}
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
              <SymbolChart
                className="AccountProfileInstantOrder__chart"
                symbol={symbol}
                accountUuid={accountUuid}
                loading={!symbol}
                width={(size.width - 55) / 2} // 30px padding of window content and 25px margin-right from chart
                height={size.height / 2}
              />
              <GeneralNewOrderForm
                accountUuid={accountUuid}
                hotKeysEnabled={isOpen}
                onSymbolChanged={setSymbol}
                onSuccess={onSuccess}
              />
            </div>
          </div>
        </Rnd>
      </div>
    </If>
  );
};

export default React.memo(AccountProfileInstantOrder);
