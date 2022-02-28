import React from 'react';
import compose from 'compose-function';
import Hotkeys from 'react-hot-keys';
import I18n from 'i18n-js';
import { Modal } from 'types';
import withModals from 'hoc/withModals';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import permissions from 'config/permissions';
// import { CONDITIONS } from 'utils/permissions';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import PermissionContent from 'components/PermissionContent';
// import CreditModal from 'routes/TradingEngine/TradingEngineManager/modals/CreditModal';
import NewOrderModal from 'routes/TE/modals/NewOrderModal';
import './AccountProfileHeader.scss';

type Props = {
  modals: {
    creditModal: Modal,
    newOrderModal: Modal,
  }
  account: {
    uuid: string,
    login: number,
    name: string,
    profileUuid: string,
  }
}

const AccountProfileHeader = (props: Props) => {
  const handleNewOrderClick = () => {
    const {
      modals: {
        newOrderModal,
      },
      account: {
        login,
      },
    } = props;

    newOrderModal.show({
      login: login.toString(),
      onSuccess: () => EventEmitter.emit(ORDER_RELOAD),
    });
  };

  const { account } = props;
  const {
    name = '',
    login = '',
    profileUuid = '',
  } = account;

  return (
    <div className="AccountProfileHeader">
      {/* Hotkey on F9 button to open new order modal */}
      <Hotkeys
        keyName="f9"
        onKeyUp={handleNewOrderClick}
      />

      <div className="AccountProfileHeader__topic">
        <div className="AccountProfileHeader__title">
          <Uuid uuid={login.toString()} uuidPrefix="WT" />
          <div>{name}</div>
        </div>

        <div className="AccountProfileHeader__uuid">
          <Uuid uuid={profileUuid} uuidPrefix="PL" />
        </div>
      </div>

      <div className="AccountProfileHeader__actions">
        <PermissionContent permissions={permissions.WE_TRADING.CREATE_ORDER}>
          <Button
            className="AccountProfileHeader__action"
            onClick={handleNewOrderClick}
            commonOutline
            small
          >
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NEW_ORDER')}
          </Button>
        </PermissionContent>

        {/* <PermissionContent */}
        {/*   permissions={[ */}
        {/*     permissions.WE_TRADING.CREDIT_IN, */}
        {/*     permissions.WE_TRADING.CREDIT_OUT, */}
        {/*   ]} */}
        {/*   permissionsCondition={CONDITIONS.OR} */}
        {/* > */}
        {/*   <Button */}
        {/*     className="AccountProfileHeader__action" */}
        {/*     onClick={creditModal.show} */}
        {/*     commonOutline */}
        {/*     small */}
        {/*   > */}
        {/*     {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.CREDIT')} */}
        {/*   </Button> */}
        {/* </PermissionContent> */}
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    newOrderModal: NewOrderModal,
    // creditModal: CreditModal,
  }),
)(AccountProfileHeader);
