import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import ReactSwitch from 'components/ReactSwitch';
import EnableShowFtdToAffiliateMutation from './graphql/EnableShowFtdToAffiliateMutation';
import DisableShowFtdToAffiliateMutation from './graphql/DisableShowFtdToAffiliateMutation';
import './AffiliateSettings.scss';

class AffiliateSettings extends PureComponent {
  static propTypes = {
    enableShowFtdToAffiliate: PropTypes.func.isRequired,
    disableShowFtdToAffiliate: PropTypes.func.isRequired,
    showFtdToAffiliate: PropTypes.bool.isRequired,
    profileUuid: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  state = {
    showFtdToAffiliate: this.props.showFtdToAffiliate,
  }

  enableToggleFTD = async () => {
    const { enableShowFtdToAffiliate, profileUuid } = this.props;

    await enableShowFtdToAffiliate({
      variables: {
        profileUuid,
      },
    });

    this.setState({ showFtdToAffiliate: true });
    this.notifySuccessToggleSwitch();
  }

  disableToggleFTD = async () => {
    const { disableShowFtdToAffiliate, profileUuid } = this.props;

    await disableShowFtdToAffiliate({
      variables: {
        profileUuid,
      },
    });

    this.setState({ showFtdToAffiliate: false });
    this.notifySuccessToggleSwitch();
  }

  onErrorToggleSwitch = (e) => {
    const error = parseErrors(e);
    this.notifyErrorToggleSwitch(error.message);
  }

  notifySuccessToggleSwitch = () => {
    const { notify } = this.props;

    notify({
      level: 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
      message: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.SUCCESS'),
    });
  }

  notifyErrorToggleSwitch = (message) => {
    const { notify } = this.props;

    notify({
      level: 'error',
      title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
      message: message
        || I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.ERROR'),
    });
  }

  isToggleDisabled = () => {
    const { permission } = this.props;
    const { showFtdToAffiliate } = this.state;

    const isAllowedToDisable = permission.allows(permissions.PAYMENT.DISABLE_SHOW_FTD_TO_AFFILIATE);
    const isAllowedToEnable = permission.allows(permissions.PAYMENT.ENABlE_SHOW_FTD_TO_AFFILIATE);

    if (showFtdToAffiliate && !isAllowedToDisable) {
      return true;
    }

    if (!showFtdToAffiliate && !isAllowedToEnable) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div className="AffiliateSettings">
        <div className="AffiliateSettings__title">
          {I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.TITLE')}
        </div>
        <ReactSwitch
          on={this.state.showFtdToAffiliate}
          stopPropagation
          disabled={this.isToggleDisabled()}
          className="AffiliateSettings__switcher"
          label={I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.LABEL')}
          labelPosition="right"
          onClick={this.state.showFtdToAffiliate ? this.disableToggleFTD : this.enableToggleFTD}
          onError={this.onErrorToggleSwitch}
        />
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withPermission,
  withRequests({
    enableShowFtdToAffiliate: EnableShowFtdToAffiliateMutation,
    disableShowFtdToAffiliate: DisableShowFtdToAffiliateMutation,
  }),
)(AffiliateSettings);
