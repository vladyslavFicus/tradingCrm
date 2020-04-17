import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { shortify } from 'utils/uuid';

class PaymentAccount extends PureComponent {
  static propTypes = {
    account: PropTypes.string.isRequired,
  };

  renderPaymentAccount = (account) => {
    const creditCardMatch = account
      ? account.match(/^(mc|visa)-(\d{4})/i)
      : null;

    let formatted = shortify(account, null, 2);

    if (creditCardMatch) {
      const [, provider, lastNumbers] = creditCardMatch;

      formatted = `${provider} *${lastNumbers}`;
    }

    return formatted;
  };

  render() {
    const { account } = this.props;

    return (
      <span className="payment-account">
        {this.renderPaymentAccount(account)}
      </span>
    );
  }
}

export default PaymentAccount;
