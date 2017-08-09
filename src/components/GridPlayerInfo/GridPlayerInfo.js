import React from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import GridPlayerInfoPlaceholder from '../GridPlayerInfoPlaceholder';
import Uuid from '../../components/Uuid';

const GridPlayerInfo = ({ profile, onClick, mainInfoClassName, id }) => (
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
          <Uuid
            uuid={profile.playerUUID}
            uuidPrefix={profile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : ''}
          />
          {!!profile.languageCode && <span> - {profile.languageCode}</span>}
        </div>
      </div>
    }
  </GridPlayerInfoPlaceholder>
);
GridPlayerInfo.propTypes = {
  profile: PropTypes.userProfile.isRequired,
  onClick: PropTypes.func,
  mainInfoClassName: PropTypes.string,
  id: PropTypes.string,
};
GridPlayerInfo.defaultProps = {
  onClick: null,
  mainInfoClassName: 'font-weight-700',
  id: null,
};

export default GridPlayerInfo;
