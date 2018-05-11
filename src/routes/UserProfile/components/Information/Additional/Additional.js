import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import Switch from '../../../../../components/Forms/Switch';
import { marketingTypes } from './constants';
import { statuses } from '../../../../../constants/user';
import { withNotifications } from '../../../../../components/HighOrder';
import Permissions from '../../../../../utils/permissions';
import permissions from '../../../../../config/permissions';

const SUBSCRIPTION_TYPE_SMS = 'marketingSMS';
const SUBSCRIPTION_TYPE_NEWS = 'marketingNews';
const SUBSCRIPTION_TYPE_MAIL = 'marketingMail';

class Additional extends Component {
  static propTypes = {
    profileStatus: PropTypes.string,
    initialValues: PropTypes.shape({
      marketingMail: PropTypes.bool,
      marketingNews: PropTypes.bool,
      marketingSMS: PropTypes.bool,
    }),
    updateSubscription: PropTypes.func.isRequired,
  };
  static defaultProps = {
    initialValues: {
      marketingMail: false,
      marketingNews: false,
      marketingSMS: false,
    },
    profileStatus: '',
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  handleSwitch = name => async (value) => {
    const { initialValues, updateSubscription, notify } = this.props;
    const {
      data: {
        profile: { updateSubscription: response },
      },
    } = await updateSubscription({ ...initialValues, [name]: value }, name);
    const message = `${I18n.t(marketingTypes[name])}
          ${value ? I18n.t('COMMON.ACTIONS.ON') : I18n.t('COMMON.ACTIONS.OFF')}
          ${response.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`;

    notify({
      level: response.error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.MARKETING.TITLE'),
      message,
    });


    return response;
  };

  render() {
    const { initialValues, profileStatus } = this.props;
    const disabled = profileStatus === statuses.SUSPENDED
      || !(new Permissions(permissions.USER_PROFILE.UPDATE_MARKETING_SETTINGS)).check(this.context.permissions);

    return (
      <div className="account-details__additional-info">
        <span className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PROFILE.ADDITIONAL.TITLE')}
        </span>
        <div className="card">
          <div className="card-body">
            <span className="account-details__additional-info__label">
              {I18n.t('PLAYER_PROFILE.MARKETING.TITLE')}
            </span>
            <div className={classNames(
              { 'account-details__additional-info_disabled-triggers': disabled })}
            >
              <div className="row">
                <div className="col-sm-8">
                  <span>
                    {I18n.t('PLAYER_PROFILE.MARKETING.SMS')}
                  </span>
                </div>
                <div className="col-sm-4 text-right">
                  <Switch
                    active={initialValues[SUBSCRIPTION_TYPE_SMS] || false}
                    handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_SMS)}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-8">
                  <span>
                    {I18n.t('PLAYER_PROFILE.MARKETING.NEWS')}
                  </span>
                </div>
                <div className="col-sm-4 text-right">
                  <Switch
                    active={initialValues[SUBSCRIPTION_TYPE_NEWS] || false}
                    handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_NEWS)}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-8">
                  <span>
                    {I18n.t('PLAYER_PROFILE.MARKETING.MAIL')}
                  </span>
                </div>
                <div className="col-sm-4 text-right">
                  <Switch
                    active={initialValues[SUBSCRIPTION_TYPE_MAIL] || false}
                    handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_MAIL)}
                    disabled={disabled}
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

export default withNotifications(Additional);

