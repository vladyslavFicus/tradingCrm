/* eslint-disable */

import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import { withRequests } from 'apollo';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import ReactSwitch from 'components/ReactSwitch';
import UpdateShowFTDMutation from './graphql/UpdateShowFTDMutation';
import './FirstTimeDepositToggle.scss';

class FirstTimeDepositToggle extends PureComponent {
  static propTypes = {
    clientData: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    updateShowFTD: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleToggleFTD = async (enabled) => {
    const { updateShowFTD } = this.props;

    try {
      const test = await updateShowFTD({ variables: {
        allowFirstTimeDeposit: enabled,
        playerUUID: 'blabla',
      } });
    } catch(e) {
      console.log('ytytyt---', e);
    }
  }

  render() {
    return (
      <div className="FirstTimeDepositToggle">
        <div className="ClientKycForm__title">
          {I18n.t('PLAYER_PROFILE.PROFILE.FTD_TOGGLE.TITLE')}
        </div>
        <ReactSwitch
          on
          stopPropagation
          className="FirstTimeDepositToggle__switcher"
          label={I18n.t('PLAYER_PROFILE.PROFILE.FTD_TOGGLE.LABEL')}
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
    updateShowFTD: UpdateShowFTDMutation,
  }),
)(FirstTimeDepositToggle);
