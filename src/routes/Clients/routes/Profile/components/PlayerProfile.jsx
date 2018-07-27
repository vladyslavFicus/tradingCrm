import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { playerProfileViewTypes } from '../../../../../constants';
import ProfileContainer from '../containers/ProfileContainer';

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
    location: PropTypes.object.isRequired,
  };

  static contextTypes = {
    addPanel: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      match: { params: { id } },
      auth,
      location: { pathname },
      settings,
    } = this.props;

    if (settings.playerProfileViewType === playerProfileViewTypes.frame && !window.isFrame) {
      this.context.addPanel({
        uuid: id,
        auth,
        path: pathname.replace(`/players/${id}/`, ''),
      });
    }
  }

  render() {
    const { settings } = this.props;

    return (
      <Choose>
        <When condition={settings.playerProfileViewType !== playerProfileViewTypes.frame || window.isFrame}>
          <ProfileContainer />
        </When>
        <Otherwise>
          <Redirect to="/players/list" />
        </Otherwise>
      </Choose>
    );
  }
}

export default PlayerProfile;
