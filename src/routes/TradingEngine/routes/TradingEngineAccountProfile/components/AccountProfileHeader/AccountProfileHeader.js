import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import DepositWithdrawalModal from 'routes/TradingEngine/modals/DepositWithdrawalModal';
import NewOrderModal from 'routes/TradingEngine/modals/NewOrderModal';
import './AccountProfileHeader.scss';

class AccountProfileHeader extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      depositWithdrawalModal: PropTypes.modal,
      newOrderModal: PropTypes.modal,
    }).isRequired,
  };

  render() {
    const {
      modals: {
        depositWithdrawalModal,
        newOrderModal,
      },
    } = this.props;

    return (
      <div className="AccountProfileHeader">
        <div className="AccountProfileHeader__topic">
          <div className="AccountProfileHeader__title">
            <div>123-412-123</div>
            <div>Vasya Pupkin</div>
          </div>

          <div className="AccountProfileHeader__uuid">
            <Uuid uuid="UUID-TEST-NUMBER" uuidPrefix="AC" />
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
            onClick={() => {}}
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
})(AccountProfileHeader);
