import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { playerProfileViewTypes } from '../../../../../constants';
import Profile from '../containers/ProfileContainer';

class PlayerProfile extends PureComponent {
  static propTypes = {
    brandId: PropTypes.string.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    settings: PropTypes.shape({
      playerProfileViewType: PropTypes.string.isRequired,
    }).isRequired,
    addUserPanel: PropTypes.func.isRequired,
    uuid: PropTypes.string.isRequired,
  };

  compondetDidMount() {
    const {
      location,
      match: { params: { id } },
      uuid,
      brandId,
      settings,
      addUserPanel,
    } = this.props;

    if (settings.playerProfileViewType === playerProfileViewTypes.frame && !window.isFrame) {
      addUserPanel({
        fullName: '',
        login: '',
        uuid: id,
        path: location.pathname,
        brandId,
        authorId: uuid,
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
