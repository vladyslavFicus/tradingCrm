import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import MiniProfile from 'components/MiniProfile';
import Uuid from 'components/Uuid';

class GridPlayerInfo extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    profile: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      fullName: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      languageCode: PropTypes.string,
    }).isRequired,
    mainInfoClassName: PropTypes.string,
  };

  static defaultProps = {
    id: null,
    mainInfoClassName: 'font-weight-700',
  };

  render() {
    const { profile, mainInfoClassName, id } = this.props;
    const { uuid, firstName, lastName, languageCode } = profile;

    const fullName = profile.fullName || `${firstName} ${lastName}`;

    return (
      <If condition={profile}>
        <div className="max-width-200">
          <Link
            className={mainInfoClassName}
            to={`/clients/${uuid}/profile`}
            target="_blank"
          >
            {fullName}
          </Link>

          <div
            className="font-size-11"
            id={`${id ? `${id}-` : ''}players-list-${uuid}-additional`}
          >
            <MiniProfile id={uuid} type="player">
              <Uuid uuid={uuid} />
            </MiniProfile>
            {!!languageCode && <span> - {languageCode}</span>}
          </div>
        </div>
      </If>
    );
  }
}

export default GridPlayerInfo;
