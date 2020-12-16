import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import './ClientLastActivity.scss';

class ClientLastActivity extends PureComponent {
  static propTypes = {
    client: PropTypes.profile.isRequired,
  };

  render() {
    const { client } = this.props;

    const { online, lastActivity } = client?.profileView || {};
    const { eventType, eventValue, location, date } = lastActivity || {};

    const lastActivityDate = date && moment.utc(date).local();
    const lastActivityType = online ? 'ONLINE' : 'OFFLINE';

    return (
      <div className="ClientLastActivity">
        <div className="ClientLastActivity__title">{I18n.t('CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.TITLE')}</div>

        <div
          className={
            classNames('ClientLastActivity__status', {
              'ClientLastActivity__status--online': lastActivityType === 'ONLINE',
              'ClientLastActivity__status--offline': lastActivityType === 'OFFLINE',
            })
          }
        >
          {I18n.t(`CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.STATUS.${lastActivityType}`)}
        </div>

        <If condition={lastActivityDate}>
          <div className="ClientLastActivity__text-secondary">
            {lastActivityDate.fromNow()}
          </div>
          <div className="ClientLastActivity__text-secondary">
            {I18n.t('COMMON.ON')} {lastActivityDate.format('DD.MM.YYYY')}
          </div>
        </If>

        <If condition={location}>
          <div>
            <span className="ClientLastActivity__text-primary">
              {I18n.t('CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.LOCATION')}:
            </span>
            <span className="ClientLastActivity__text-secondary"> {location}</span>
          </div>
        </If>

        <If condition={eventType === 'MODALVIEW'}>
          <div>
            <span className="ClientLastActivity__text-primary">
              {I18n.t('CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.MODAL')}:
            </span>
            <span className="ClientLastActivity__text-secondary"> {eventValue}</span>
          </div>
        </If>
      </div>
    );
  }
}

export default ClientLastActivity;
