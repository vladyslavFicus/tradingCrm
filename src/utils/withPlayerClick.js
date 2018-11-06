import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { playerProfileViewTypes } from '../constants';
import history from '../router/history';
import rootConfig from '../config';
import { markets } from '../constants/markets';

const rootUrlName = rootConfig.market === markets.crm ? 'clients' : 'players';

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
        username,
        playerUUID,
      } = data;

      if (this.context.settings.playerProfileViewType === playerProfileViewTypes.page) {
        history.push(`/${rootUrlName}/${data.playerUUID}/profile`);
      } else {
        const panelData = {
          fullName: (firstName || lastName)
            ? [firstName, lastName].filter(v => v).join(' ')
            : I18n.t('PLAYER_PROFILE.PROFILE.HEADER.NO_FULLNAME'),
          username,
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
