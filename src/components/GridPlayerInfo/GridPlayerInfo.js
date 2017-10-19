import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import GridPlayerInfoPlaceholder from '../GridPlayerInfoPlaceholder';
import Uuid from '../../components/Uuid';
import { types as miniProfileTypes } from '../../constants/miniProfile';
import MiniProfile from '../../components/MiniProfile';

class GridPlayerInfo extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    fetchPlayerProfile: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    mainInfoClassName: PropTypes.string,
    id: PropTypes.string,
    openAsPage: PropTypes.bool,
  };
  static defaultProps = {
    onClick: null,
    mainInfoClassName: 'font-weight-700',
    id: null,
    openAsPage: false,
  };
  static contextTypes = {
    addPanel: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleClick = () => {
    const { profile, openAsPage } = this.props;

    if (openAsPage) {
      this.context.router.push(`/users/${profile.playerUUID}/profile`);
    } else {
      const panelData = {
        fullName: `${profile.firstName || '-'} ${profile.lastName || '-'}`,
        login: profile.username,
        uuid: profile.playerUUID,
      };

      this.context.addPanel(panelData);
    }
  };

  render() {
    const { fetchPlayerProfile, profile, onClick, mainInfoClassName, id } = this.props;

    return (
      <GridPlayerInfoPlaceholder ready={!!profile} firstLaunchOnly>
        {
          !!profile &&
          <div>
            <div
              className={classNames(mainInfoClassName, { 'cursor-pointer': !!onClick })}
              id={`${id ? `${id}-` : ''}players-list-${profile.playerUUID}-main`}
              onClick={onClick}
            >
              {profile.firstName} {profile.lastName} {!!profile.age && `(${profile.age})`}
              {' '}
              {profile.kycCompleted && <i className="fa fa-check text-success" />}
            </div>

            <div
              className="font-size-11"
              id={`${id ? `${id}-` : ''}players-list-${profile.playerUUID}-additional`}
            >
              {!!profile.login && <span>{profile.login} - </span>}
              <MiniProfile
                target={profile.playerUUID}
                dataSource={fetchPlayerProfile}
                type={miniProfileTypes.PLAYER}
              >
                <Uuid
                  uuid={profile.playerUUID}
                  uuidPrefix={profile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : ''}
                />
              </MiniProfile>
              {!!profile.languageCode && <span> - {profile.languageCode}</span>}
            </div>
          </div>
        }
      </GridPlayerInfoPlaceholder>
    );
  }
}

export default GridPlayerInfo;
