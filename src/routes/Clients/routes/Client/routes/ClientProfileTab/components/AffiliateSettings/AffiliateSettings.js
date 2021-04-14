import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import ReactSwitch from 'components/ReactSwitch';
import ChangeShowFTDtoAffiliateMutation from './graphql/ChangeShowFtdToAffiliateMutation';
import './AffiliateSettings.scss';

class AffiliateSettings extends PureComponent {
  static propTypes = {
    changeShowFTDtoAffiliate: PropTypes.func.isRequired,
    showFtdToAffiliate: PropTypes.bool.isRequired,
    profileUuid: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleToggleFTD = async (enabled) => {
    const { changeShowFTDtoAffiliate, profileUuid, notify } = this.props;

    try {
      await changeShowFTDtoAffiliate({
        variables: {
          showFtdToAffiliate: enabled,
          profileUuid,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.SUCCESS'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.NOTIFICATIONS.ERROR'),
      });
    }
  }

  render() {
    return (
      <div className="AffiliateSettings">
        <div className="AffiliateSettings__title">
          {I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.TITLE')}
        </div>
        <ReactSwitch
          on={this.props.showFtdToAffiliate}
          stopPropagation
          className="AffiliateSettings__switcher"
          label={I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.LABEL')}
          labelPosition="right"
          onClick={this.handleToggleFTD}
        />
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    changeShowFTDtoAffiliate: ChangeShowFTDtoAffiliateMutation,
  }),
)(AffiliateSettings);
