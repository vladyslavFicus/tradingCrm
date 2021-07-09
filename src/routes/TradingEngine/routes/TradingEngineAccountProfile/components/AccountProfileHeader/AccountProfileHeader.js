import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import CreditModal from 'routes/TradingEngine/modals/CreditModal';
import DepositWithdrawalModal from 'routes/TradingEngine/modals/DepositWithdrawalModal';
import NewOrderModal from 'routes/TradingEngine/modals/NewOrderModal';
import './AccountProfileHeader.scss';

class AccountProfileHeader extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      creditModal: PropTypes.modalType,
      depositWithdrawalModal: PropTypes.modal,
      newOrderModal: PropTypes.modal,
    }).isRequired,
    account: PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.string,
      profileUuid: PropTypes.string,
    }),
  }

  static defaultProps = {
    account: {
      uuid: '',
      name: '',
      profileUuid: '',
    },
  }

  render() {
    const {
      modals: {
        depositWithdrawalModal,
        newOrderModal,
        creditModal,
      },
      account,
    } = this.props;

    const {
      uuid,
      name,
      profileUuid,
    } = account;

    return (
      <div className="AccountProfileHeader">
        <div className="AccountProfileHeader__topic">
          <div className="AccountProfileHeader__title">
            <Uuid uuid={uuid} uuidPrefix="WET" />
            <div>{name}</div>
          </div>

          <div className="AccountProfileHeader__uuid">
            <Uuid uuid={profileUuid} uuidPrefix="AC" />
          </div>
        </div>

        <div className="AccountProfileHeader__actions">
          <Button
            className="AccountProfileHeader__action"
            onClick={() => newOrderModal.show()}
            commonOutline
            small
          >
            New order
          </Button>

          <Button
            className="AccountProfileHeader__action"
            onClick={() => depositWithdrawalModal.show()}
            commonOutline
            small
          >
            Deposit
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
  depositWithdrawalModal: DepositWithdrawalModal,
  newOrderModal: NewOrderModal,
  creditModal: CreditModal,
})(AccountProfileHeader);
