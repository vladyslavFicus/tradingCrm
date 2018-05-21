import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { playerProfileViewTypes } from '../../../../../constants';
import Profile from '../containers/ProfileContainer';

class PlayerProfile extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    settings: PropTypes.shape({
      playerProfileViewType: PropTypes.string.isRequired,
    }).isRequired,
    auth: PropTypes.object.isRequired,
  };

  static contextTypes = {
    addPanel: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      match: { params: { id } },
      auth,
      settings,
    } = this.props;

    if (settings.playerProfileViewType === playerProfileViewTypes.frame && !window.isFrame) {
      this.context.addPanel({
        uuid: id,
        auth,
      });
    }
  }

  render() {
    const { settings } = this.props;
    return (
      <Choose>
        <When condition={settings.playerProfileViewType !== playerProfileViewTypes.frame || window.isFrame}>
          <Profile />
        </When>
        <Otherwise>
          <Redirect to="/players/list" />
        </Otherwise>
      </Choose>
    );
  }
}

export default PlayerProfile;
