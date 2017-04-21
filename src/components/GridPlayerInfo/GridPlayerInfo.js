import React from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';
import GridPlayerInfoPlaceholder from '../GridPlayerInfoPlaceholder';

const GridPlayerInfo = props => (
  <GridPlayerInfoPlaceholder ready={!!props.profile} firstLaunchOnly>
    {
      !!props.profile &&
      <div>
        <div
          className={classNames('font-weight-700', { 'cursor-pointer': !!props.onClick }, props.mainInfoClassName)}
          onClick={props.onClick}
        >
          {[props.profile.firstName, props.profile.lastName, `(${props.profile.age})`].join(' ')}
          {' '}
          {props.profile.kycCompleted && <i className="fa fa-check text-success" />}
        </div>

        <div className="font-size-11 color-default line-height-1">
          <div>{[props.profile.username, shortify(props.profile.uuid, 'PL')].join(' - ')}</div>
          <div>{props.profile.languageCode}</div>
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
