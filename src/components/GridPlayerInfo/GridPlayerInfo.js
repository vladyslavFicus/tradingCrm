import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import MiniProfile from 'components/MiniProfile';
import Uuid from 'components/Uuid';
import './GridPlayerInfo.scss';

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
    mainInfoClassName: 'GridPlayerInfo__text-primary',
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { profile: { uuid } } = this.props;

    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  render() {
    const { profile, mainInfoClassName, id } = this.props;
    const { uuid, firstName, lastName, languageCode } = profile;

    const fullName = profile.fullName || `${firstName} ${lastName}`;

    return (
      <If condition={profile}>
        <div className="GridPlayerInfo">
          <div className={mainInfoClassName} onClick={this.handleClick}>
            {fullName}
          </div>

          <div
            className="GridPlayerInfo__text-secondary"
            id={`${id ? `${id}-` : ''}players-list-${uuid}-additional`}
          >
            <MiniProfile id={uuid} type="client">
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
