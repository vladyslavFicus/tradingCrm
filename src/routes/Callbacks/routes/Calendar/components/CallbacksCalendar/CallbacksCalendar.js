import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Link } from 'react-router-dom';
import CallbacksCalendarComponent from '../../../../../../components/CallbacksCalendar';
import Placeholder from '../../../../../../components/Placeholder';
import './CallbacksCalendar.scss';

class CallbacksCalendar extends PureComponent {
  renderTopContent = ({ callbacks, callbacks: { loading } }) => {
    const totalElements = get(callbacks, 'callbacks.data.totalElements', 0);

    return (
      <div className="card-heading justify-content-between">
        <Placeholder
          ready={!loading}
          customPlaceholder={<div className="CallbacksCalendarPage__placeholder animated-background" />}
        >
          <span className="font-size-20 height-55 users-list-header">
            <div>
              <strong>{totalElements} </strong>
              {I18n.t('CALLBACKS.CALLBACKS')}
            </div>
          </span>
        </Placeholder>
        <Link to="/callbacks/list">
          <i className="font-size-20 fa fa-list" />
        </Link>
      </div>
    );
  };

  render() {
    return (
      <div className="card">
        <CallbacksCalendarComponent
          calendarClassName="CallbacksCalendarPage__calendar"
          renderTopContent={this.renderTopContent}
        />
      </div>
    );
  }
}

export default CallbacksCalendar;
