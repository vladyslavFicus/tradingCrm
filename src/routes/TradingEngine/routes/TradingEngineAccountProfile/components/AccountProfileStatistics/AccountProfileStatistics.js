import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import './AccountProfileStatistics.scss';

class AccountProfileStatistics extends PureComponent {
  static propTypes = {
    totalElements: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className="card-heading card-heading--is-sticky">
        <div className="AccountProfileStatistics__statistics-block">
          <span className="font-size-20">
            <strong>{this.props.totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.HEADLINE')}
          </span>
          <div className="AccountProfileStatistics__statistics">
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.DEPOSIT')}
              </strong>: <span>500</span>
            </div>
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.WITHDRAW')}
              </strong>: <span>500</span>
            </div>
          </div>
          <div className="AccountProfileStatistics__statistics">
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.CREDIT')}
              </strong>: <span>1000</span>
            </div>
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.BALANCE')}
              </strong>: <span>0</span>
            </div>
          </div>
          <div className="AccountProfileStatistics__statistics">
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.EQUITY')}
              </strong>: <span>1071.26</span>
            </div>
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN')}
              </strong>: <span>121</span>
            </div>
          </div>
          <div className="AccountProfileStatistics__statistics">
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.FREE_MARGIN')}
              </strong>: <span>950.26</span>
            </div>
            <div>
              <strong>
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN_LEVEL')}
              </strong>: <span>885%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountProfileStatistics;
