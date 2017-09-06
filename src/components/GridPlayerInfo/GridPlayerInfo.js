import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import GridPlayerInfoPlaceholder from '../GridPlayerInfoPlaceholder';
import Uuid from '../../components/Uuid';
import { actionCreators as miniProfileActionCreators } from '../../redux/modules/miniProfile';
import { types as miniProfileTypes } from '../../constants/miniProfile';
import MiniProfile from '../../components/MiniProfile';

class GridPlayerInfo extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    fetchUserMiniProfile: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    mainInfoClassName: PropTypes.string,
    id: PropTypes.string,
  };
  static defaultProps = {
    onClick: null,
    mainInfoClassName: 'font-weight-700',
    id: null,
  };
  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  onMiniProfileHover = async (playerUUID, type) => {
    const action = await this.props.fetchUserMiniProfile(playerUUID);

    if (action && !action.error) {
      this.context.miniProfile.onShowMiniProfile(`id-${playerUUID}`, action.payload, type);
    }
  }

  render() {
    const { profile, onClick, mainInfoClassName, id } = this.props;

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
              {!!profile.username && <span>{profile.username} - </span>}
              <MiniProfile
                target={profile.playerUUID}
                onMouseOver={() => this.onMiniProfileHover(profile.playerUUID, miniProfileTypes.PLAYER)}
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

export default connect(() => ({}), {
  fetchUserMiniProfile: miniProfileActionCreators.fetchUserMiniProfile,
})(GridPlayerInfo);
