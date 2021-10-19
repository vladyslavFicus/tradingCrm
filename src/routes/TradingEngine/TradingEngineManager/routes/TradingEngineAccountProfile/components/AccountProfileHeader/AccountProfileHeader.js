import React, { PureComponent } from 'react';
import Hotkeys from 'react-hot-keys';
import PropTypes from 'constants/propTypes';
import withModals from 'hoc/withModals';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import CreditModal from 'routes/TradingEngine/TradingEngineManager/modals/CreditModal';
import NewOrderModal from 'routes/TradingEngine/TradingEngineManager/modals/NewOrderModal';
import './AccountProfileHeader.scss';

class AccountProfileHeader extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      creditModal: PropTypes.modalType,
      newOrderModal: PropTypes.modal,
    }).isRequired,
    account: PropTypes.shape({
      uuid: PropTypes.string,
      login: PropTypes.number,
      name: PropTypes.string,
      profileUuid: PropTypes.string,
    }),
  }

  static defaultProps = {
    account: {
      uuid: '',
      login: '',
      name: '',
      profileUuid: '',
    },
  }

  handleNewOrderClick = () => {
    const {
      modals: {
        newOrderModal,
      },
      account: {
        uuid,
      },
    } = this.props;

    newOrderModal.show({
      accountUuid: uuid,
      onSuccess: () => EventEmitter.emit(ORDER_RELOAD),
    });
  };

  render() {
    const {
      modals: {
        creditModal,
      },
      account,
    } = this.props;

    const {
      name,
      login,
      profileUuid,
    } = account;

    return (
      <div className="AccountProfileHeader">
        {/* Hotkey on F9 button to open new order modal */}
        <Hotkeys
          keyName="f9"
          onKeyUp={this.handleNewOrderClick}
        />

        <div className="AccountProfileHeader__topic">
          <div className="AccountProfileHeader__title">
            <Uuid uuid={login.toString()} uuidPrefix="WET" />
            <div>{name}</div>
          </div>

          <div className="AccountProfileHeader__uuid">
            <Uuid uuid={profileUuid} uuidPrefix="PL" />
          </div>
        </div>

        <div className="AccountProfileHeader__actions">
          <Button
            className="AccountProfileHeader__action"
            onClick={this.handleNewOrderClick}
            commonOutline
            small
          >
            New order
          </Button>

          <Button
            className="AccountProfileHeader__action"
            onClick={() => creditModal.show()}
            commonOutline
            small
          >
            Credit
          </Button>
        </div>
      </div>
    );
  }
}

export default withModals({
  newOrderModal: NewOrderModal,
  creditModal: CreditModal,
})(AccountProfileHeader);
