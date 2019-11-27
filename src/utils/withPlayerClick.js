import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { playerProfileViewTypes } from '../constants';
import history from '../router/history';

const withPlayerClick = WrappedComponent => class OpenProfile extends Component {
    static contextTypes = {
      settings: PropTypes.shape({
        playerProfileViewType: PropTypes.oneOf(['page', 'frame']).isRequired,
      }).isRequired,
      addPanel: PropTypes.func.isRequired,
    };

    handlePlayerClick = (data) => {
      const {
        auth,
        firstName,
        lastName,
        fullName,
        playerUUID,
      } = data;

      if (this.context.settings.playerProfileViewType === playerProfileViewTypes.page) {
        history.push(`/clients/${data.playerUUID}/profile`);
      } else {
        const panelData = {
          fullName: fullName || (
            (firstName || lastName)
              ? [firstName, lastName].filter(v => v).join(' ')
              : I18n.t('PLAYER_PROFILE.PROFILE.HEADER.NO_FULLNAME')),
          uuid: playerUUID,
          auth,
        };

        this.context.addPanel(panelData);
      }
    };

    render() {
      return <WrappedComponent {...this.props} onPlayerClick={this.handlePlayerClick} />;
    }
};

export default withPlayerClick;
