import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { playerProfileViewTypes } from '../constants';

const withPlayerClick = (WrappedComponent) => {
  return class OpenProfile extends Component {
    static contextTypes = {
      settings: PropTypes.shape({
        playerProfileViewType: PropTypes.oneOf(['page', 'frame']).isRequired,
      }).isRequired,
      addPanel: PropTypes.func.isRequired,
      router: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired,
    };

    handlePlayerClick = (data) => {
      if (this.context.settings.playerProfileViewType === playerProfileViewTypes.page) {
        this.context.router.push(`/users/${data.playerUUID}/profile`);
      } else {
        const panelData = {
          fullName: (data.firstName || data.lastName)
            ? [data.firstName, data.lastName].filter(v => v).join(' ')
            : I18n.t('PLAYER_PROFILE.PROFILE.HEADER.NO_FULLNAME'),
          username: data.username,
          uuid: data.playerUUID,
        };

        this.context.addPanel(panelData);
      }
    };

    render() {
      return <WrappedComponent {...this.props} onPlayerClick={this.handlePlayerClick} />;
    }
  };
};

export default withPlayerClick;
