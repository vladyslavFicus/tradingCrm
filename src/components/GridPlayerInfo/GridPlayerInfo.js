import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import GridPlayerInfoPlaceholder from '../GridPlayerInfoPlaceholder';
import Uuid from '../Uuid';
import { types as miniProfileTypes } from '../../constants/miniProfile';
import MiniProfile from '../MiniProfile';

class GridPlayerInfo extends Component {
  static propTypes = {
    id: PropTypes.string,
    profile: PropTypes.userProfile.isRequired,
    fetchPlayerProfile: PropTypes.func.isRequired,
    mainInfoClassName: PropTypes.string,
    clickable: PropTypes.bool,
    auth: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    id: null,
    mainInfoClassName: 'font-weight-700',
    clickable: true,
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { profile: { playerUUID } } = this.props;

    window.open(`/clients/${playerUUID}/profile`, '_blank');
  };

  render() {
    const { fetchPlayerProfile, profile, clickable, mainInfoClassName, id } = this.props;

    return (
      <GridPlayerInfoPlaceholder ready={!!profile} firstLaunchOnly>
        <If condition={!!profile}>
          <div className="max-width-200">
            <div
              className={classNames(mainInfoClassName, { 'cursor-pointer': !!clickable })}
              id={`${id ? `${id}-` : ''}players-list-${profile.playerUUID}-main`}
              onClick={this.handleClick}
            >
              {profile.firstName} {profile.lastName}
              {' '}
              {/* when KYC functionality requirements finished
                profile.kycCompleted && <i className="fa fa-check text-success" />
              */}
            </div>

            <div
              className="font-size-11"
              id={`${id ? `${id}-` : ''}players-list-${profile.playerUUID}-additional`}
            >
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
        </If>
      </GridPlayerInfoPlaceholder>
    );
  }
}

export default GridPlayerInfo;
