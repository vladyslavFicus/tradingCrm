import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
          fullName: `${data.firstName || '-'} ${data.lastName || '-'}`,
          login: data.login,
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
