import React from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import GridPlayerInfoPlaceholder from '../GridPlayerInfoPlaceholder';
import Uuid from '../../components/Uuid';

const GridPlayerInfo = props => (
  <GridPlayerInfoPlaceholder ready={!!props.profile} firstLaunchOnly>
    {
      !!props.profile &&
      <div>
        <div
          className={classNames(props.mainInfoClassName, { 'cursor-pointer': !!props.onClick })}
          onClick={props.onClick}
        >
          {[props.profile.firstName, props.profile.lastName, `(${props.profile.age})`].join(' ')}
          {' '}
          {props.profile.kycCompleted && <i className="fa fa-check text-success" />}
        </div>

        <div className="font-size-11 color-default line-height-1">
          {!!props.profile.username && <span>{props.profile.username} - </span>}
          <Uuid uuid={props.profile.uuid} uuidPrefix={props.profile.uuid.indexOf('PLAYER') === -1 ? 'PL' : ''} />
          {!!props.profile.languageCode && <span> - {props.profile.languageCode}</span>}
        </div>
      </div>
    }
  </GridPlayerInfoPlaceholder>
);
GridPlayerInfo.propTypes = {
  profile: PropTypes.userProfile.isRequired,
  onClick: PropTypes.func,
  mainInfoClassName: PropTypes.string,
};
GridPlayerInfo.defaultProps = {
  onClick: null,
  mainInfoClassName: 'font-weight-700',
};

export default GridPlayerInfo;
