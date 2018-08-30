import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import Switch from '../../../../../../../components/Forms/Switch';
import { marketingTypes } from './constants';
import { statuses } from '../../../../../../../constants/user';
import { withNotifications } from '../../../../../../../components/HighOrder';
import Permissions from '../../../../../../../utils/permissions';
import permissions from '../../../../../../../config/permissions';

const SUBSCRIPTION_TYPE_SMS = 'marketingSMS';
const SUBSCRIPTION_TYPE_MAIL = 'marketingMail';
const SUBSCRIPTION_TYPE_TAILOR_MADE_EMAIL = 'tailorMadeEmail';
const SUBSCRIPTION_TYPE_TAILOR_MADE_SMS = 'tailorMadeSMS';

class Additional extends Component {
  static propTypes = {
    profileStatus: PropTypes.string,
    initialValues: PropTypes.shape({
      marketingMail: PropTypes.bool,
      marketingSMS: PropTypes.bool,
      tailorMadeEmail: PropTypes.bool,
      tailorMadeSMS: PropTypes.bool,
    }),
    updateSubscription: PropTypes.func.isRequired,
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    initialValues: {
      marketingMail: false,
      marketingSMS: false,
    },
    profileStatus: '',
  };

  state = {
    disabled: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted = false;

  handleSwitch = name => async (value) => {
    const { initialValues, updateSubscription, notify } = this.props;

    this.setState({ disabled: true }, async () => {
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
        title: name.startsWith('marketing')
          ? I18n.t('PLAYER_PROFILE.MARKETING.SENDINGS.TITLE')
          : I18n.t('PLAYER_PROFILE.MARKETING.TAILOR_MADE.TITLE'),
        message,
      });

      if (this.mounted) {
        this.setState({ disabled: false });
      }
    });
  };

  render() {
    const { initialValues, profileStatus } = this.props;
    const disabled = this.state.disabled || profileStatus === statuses.SUSPENDED
      || !(new Permissions(permissions.USER_PROFILE.UPDATE_MARKETING_SETTINGS)).check(this.context.permissions);

    return (
      <div className="account-details__additional-info">
        <span className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PROFILE.ADDITIONAL.TITLE')}
        </span>
        <div className="card">
          <div className="card-body">
            <span className="account-details__additional-info__label">
              {I18n.t('PLAYER_PROFILE.MARKETING.SENDINGS.TITLE')}
            </span>
            <div className={classNames({ 'account-details__additional-info_disabled-triggers': disabled })}>
              <div className="row">
                <div className="col-sm-8">
                  {I18n.t('PLAYER_PROFILE.MARKETING.SENDINGS.SMS')}
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
                  {I18n.t('PLAYER_PROFILE.MARKETING.SENDINGS.MAIL')}
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
            <div className="mt-3">
              <span className="account-details__additional-info__label">
                {I18n.t('PLAYER_PROFILE.MARKETING.TAILOR_MADE.TITLE')}
              </span>
              <div className={classNames({ 'account-details__additional-info_disabled-triggers': disabled })}>
                <div className="row">
                  <div className="col-sm-8">
                    {I18n.t('PLAYER_PROFILE.MARKETING.TAILOR_MADE.EMAIL')}
                  </div>
                  <div className="col-sm-4 text-right">
                    <Switch
                      active={initialValues[SUBSCRIPTION_TYPE_TAILOR_MADE_EMAIL] || false}
                      handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_TAILOR_MADE_EMAIL)}
                      disabled={disabled}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8">
                    {I18n.t('PLAYER_PROFILE.MARKETING.TAILOR_MADE.SMS')}
                  </div>
                  <div className="col-sm-4 text-right">
                    <Switch
                      active={initialValues[SUBSCRIPTION_TYPE_TAILOR_MADE_SMS] || false}
                      handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_TAILOR_MADE_SMS)}
                      disabled={disabled}
                    />
                  </div>
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

