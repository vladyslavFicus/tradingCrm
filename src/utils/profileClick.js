import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { playerProfileViewTypes } from '../constants';

const profileClick = (WrappedComponent) => {
  return class profileOpen extends Component {
    static contextTypes = {
      settings: PropTypes.shape({
        playerProfileViewType: PropTypes.oneOf(['page', 'frame']).isRequired,
      }).isRequired,
      addPanel: PropTypes.func.isRequired,
      router: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired,
    };

    constructor(props) {
      super(props);

      this.handleOpenProfile = this.handleOpenProfile.bind(this);
    }

    handleOpenProfile(data) {
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
      return <WrappedComponent {...this.props} {...this.context} handleOpenProfile={this.handleOpenProfile} />;
    }
  };
};

export default profileClick;
