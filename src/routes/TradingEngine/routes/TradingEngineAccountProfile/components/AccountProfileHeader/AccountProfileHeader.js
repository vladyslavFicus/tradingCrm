import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import withModals from 'hoc/withModals';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import CreditModal from 'routes/TradingEngine/modals/CreditModal';
import NewOrderModal from 'routes/TradingEngine/modals/NewOrderModal';
import './AccountProfileHeader.scss';

class AccountProfileHeader extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      creditModal: PropTypes.modalType,
      newOrderModal: PropTypes.modal,
    }).isRequired,
    account: PropTypes.shape({
      login: PropTypes.string,
      name: PropTypes.string,
      profileUuid: PropTypes.string,
    }),
  }

  static defaultProps = {
    account: {
      login: '',
      name: '',
      profileUuid: '',
    },
  }

  render() {
    const {
      modals: {
        newOrderModal,
        creditModal,
      },
      account,
      handleRefetch,
    } = this.props;

    const {
      name,
      login,
      profileUuid,
    } = account;

    return (
      <div className="AccountProfileHeader">
        <div className="AccountProfileHeader__topic">
          <div className="AccountProfileHeader__title">
            <Uuid uuid={login} uuidPrefix="WET" />
            <div>{name}</div>
          </div>

          <div className="AccountProfileHeader__uuid">
            <Uuid uuid={profileUuid} uuidPrefix="PL" />
          </div>
        </div>

        <div className="AccountProfileHeader__actions">
          <Button
            className="AccountProfileHeader__action"
            onClick={() => newOrderModal.show({
              login,
              onSuccess: () => EventEmitter.emit(ORDER_RELOAD),
            })}
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
