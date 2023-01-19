import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import './ClientLastActivity.scss';

type LastActivity = {
  eventType: string,
  eventValue: string,
  location: string,
  date: string,
}

type Props = {
  lastActivity?: LastActivity,
  onlineStatus: boolean,
}

const ClientLastActivity = (props: Props) => {
  const { onlineStatus, lastActivity } = props;

  const { eventType, eventValue, location, date } = lastActivity || {};

  const lastActivityDate = date ? moment.utc(date).local() : null;
  const lastActivityType = onlineStatus ? 'ONLINE' : 'OFFLINE';

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

      <If condition={!!lastActivityDate}>
        <div className="ClientLastActivity__text-secondary">
          {lastActivityDate?.fromNow()}
        </div>

        <div className="ClientLastActivity__text-secondary">
          {I18n.t('COMMON.ON')} {lastActivityDate?.format('DD.MM.YYYY')}
        </div>
      </If>

      <If condition={!!location}>
        <div className="ClientLastActivity__location">
          <span className="ClientLastActivity__text-primary">
            {I18n.t('CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.LOCATION')}:
          </span>

          <span id="location" className="ClientLastActivity__text-secondary"> {location}</span>

          <UncontrolledTooltip
            placement="bottom"
            target="location"
            delay={{ show: 350, hide: 250 }}
            fade={false}
          >
            {location}
          </UncontrolledTooltip>
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
};


export default React.memo(ClientLastActivity);
