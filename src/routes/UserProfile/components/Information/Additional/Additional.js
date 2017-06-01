import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import Switch from '../../../../../components/Forms/Switch/index';
import { marketingTypes } from './constants';

const SUBSCRIPTION_TYPE_SMS = 'marketingSMS';
const SUBSCRIPTION_TYPE_NEWS = 'marketingNews';
const SUBSCRIPTION_TYPE_MAIL = 'marketingMail';

class Additional extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    updateSubscription: PropTypes.func.isRequired,
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
    const { initialValues } = this.props;

    return (
      <div className="player__account__details_additional">
        <span className="player__account__details-label">Additional information</span>
        <div className="panel">
          <div className="panel-body height-200">
            <small className="player__account__details_additional-label">
              Marketing
            </small>
            <div className="row">
              <div className="col-xs-8">
                <span>SMS</span>
              </div>
              <div className="col-xs-4 text-right">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_SMS]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_SMS)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-8">
                <span>News</span>
              </div>
              <div className="col-xs-4 text-right">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_NEWS]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_NEWS)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-8">
                <span>Snail mail</span>
              </div>
              <div className="col-xs-4 text-right">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_MAIL]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_MAIL)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Additional;

