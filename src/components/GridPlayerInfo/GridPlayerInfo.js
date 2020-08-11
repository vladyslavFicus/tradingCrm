import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import MiniProfile from 'components/MiniProfile';
import Uuid from 'components/Uuid';

class GridPlayerInfo extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    profile: PropTypes.shape({
      profileUuid: PropTypes.string.isRequired,
      fullName: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      languageCode: PropTypes.string,
    }).isRequired,
    mainInfoClassName: PropTypes.string,
  };

  static defaultProps = {
    id: null,
    mainInfoClassName: 'font-weight-700 cursor-pointer',
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { profile: { profileUuid } } = this.props;

    window.open(`/clients/${profileUuid}/profile`, '_blank');
  };

  render() {
    const { profile, mainInfoClassName, id } = this.props;
    const { profileUuid, firstName, lastName, languageCode } = profile;

    const fullName = profile.fullName || `${firstName} ${lastName}`;

    return (
      <If condition={profile}>
        <div className="max-width-200">
          <div className={mainInfoClassName} onClick={this.handleClick}>
            {fullName}
          </div>

          <div
            className="font-size-11"
            id={`${id ? `${id}-` : ''}players-list-${profileUuid}-additional`}
          >
            <MiniProfile id={profileUuid} type="player">
              <Uuid uuid={profileUuid} />
            </MiniProfile>
            {!!languageCode && <span> - {languageCode}</span>}
          </div>
        </div>
      </If>
    );
  }
}

export default GridPlayerInfo;
