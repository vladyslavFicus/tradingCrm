import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import GridPlayerInfoPlaceholder from '../GridPlayerInfoPlaceholder';
import Uuid from '../Uuid';

class GridPlayerInfo extends Component {
  static propTypes = {
    id: PropTypes.string,
    profile: PropTypes.userProfile.isRequired,
    mainInfoClassName: PropTypes.string,
    clickable: PropTypes.bool,
  };

  static defaultProps = {
    id: null,
    mainInfoClassName: 'font-weight-700',
    clickable: true,
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { profile: { uuid } } = this.props;

    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  render() {
    const { profile, clickable, mainInfoClassName, id } = this.props;
    const { uuid, firstName, lastName, language } = profile;

    return (
      <GridPlayerInfoPlaceholder ready={!!profile} firstLaunchOnly>
        <If condition={!!profile}>
          <div className="max-width-200">
            <div
              className={classNames(mainInfoClassName, { 'cursor-pointer': !!clickable })}
              id={`${id ? `${id}-` : ''}players-list-${uuid}-main`}
              onClick={this.handleClick}
            >
              {firstName} {lastName}
            </div>

            <div
              className="font-size-11"
              id={`${id ? `${id}-` : ''}players-list-${uuid}-additional`}
            >
              <Uuid
                uuid={uuid}
                uuidPrefix={uuid.indexOf('PLAYER') === -1 ? 'PL' : ''}
              />
              {!!language && <span> - {language}</span>}
            </div>
          </div>
        </If>
      </GridPlayerInfoPlaceholder>
    );
  }
}

export default GridPlayerInfo;
