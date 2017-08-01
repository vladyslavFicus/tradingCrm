import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import Switch from '../../../../../components/Forms/Switch';
import { marketingTypes } from './constants';
import { statuses } from '../../../../../constants/user';

const SUBSCRIPTION_TYPE_SMS = 'marketingSMS';
const SUBSCRIPTION_TYPE_NEWS = 'marketingNews';
const SUBSCRIPTION_TYPE_MAIL = 'marketingMail';

class Additional extends Component {
  static propTypes = {
    profileStatus: PropTypes.string,
    initialValues: PropTypes.object,
    updateSubscription: PropTypes.func.isRequired,
  };
  static defaultProps = {
    initialValues: null,
    profileStatus: '',
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  handleSwitch = name => async (value) => {
    const action = await this.props.updateSubscription(name, value);
    if (action) {
      const message = `${I18n.t(marketingTypes[name])}
          ${value ? I18n.t('COMMON.ACTIONS.ON') : I18n.t('COMMON.ACTIONS.OFF')}
          ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`;

      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('PLAYER_PROFILE.MARKETING.TITLE'),
        message,
      });
    }

    return action;
  };

  render() {
    const { initialValues, profileStatus } = this.props;

    return (
      <div className="account-details__additional-info">
        <span className="account-details__label">Additional information</span>
        <div className="panel">
          <div className="panel-body">
            <span className="account-details__additional-info__label">
              {I18n.t('PLAYER_PROFILE.MARKETING.TITLE')}
            </span>
            <div className={classNames(
              { 'account-details__additional-info_disabled-triggers': profileStatus === statuses.SUSPENDED })}
            >
              <div className="row">
                <div className="col-xs-8">
                  <span>
                    {I18n.t('PLAYER_PROFILE.MARKETING.SMS')}
                  </span>
                </div>
                <div className="col-xs-4 text-right">
                  <Switch
                    active={initialValues[SUBSCRIPTION_TYPE_SMS]}
                    handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_SMS)}
                    disabled={profileStatus === statuses.SUSPENDED}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-8">
                  <span>
                    {I18n.t('PLAYER_PROFILE.MARKETING.NEWS')}
                  </span>
                </div>
                <div className="col-xs-4 text-right">
                  <Switch
                    active={initialValues[SUBSCRIPTION_TYPE_NEWS]}
                    handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_NEWS)}
                    disabled={profileStatus === statuses.SUSPENDED}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-8">
                  <span>
                    {I18n.t('PLAYER_PROFILE.MARKETING.MAIL')}
                  </span>
                </div>
                <div className="col-xs-4 text-right">
                  <Switch
                    active={initialValues[SUBSCRIPTION_TYPE_MAIL]}
                    handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_MAIL)}
                    disabled={profileStatus === statuses.SUSPENDED}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Additional;

