import React, { useState } from 'react';
import classNames from 'classnames';
import Hotkeys from 'react-hot-keys';
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

        <div className={classNames('AccountProfileInstantOrder__window', {
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
      </div>
    </PermissionContent>
  );
};

export default React.memo(AccountProfileInstantOrder);
