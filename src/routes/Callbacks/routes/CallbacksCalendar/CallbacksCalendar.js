import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Link } from 'components/Link';
import CallbacksCalendarComponent from 'components/CallbacksCalendar';
import './CallbacksCalendar.scss';

class CallbacksCalendar extends PureComponent {
  renderTopContent = ({ callbacksQuery }) => {
    const totalElements = callbacksQuery.data?.callbacks?.totalElements || 0;

    return (
      <div className="CallbacksCalendar__header">
        <div className="CallbacksCalendar__title">
          <If condition={totalElements}>
            <strong>{totalElements} </strong>
          </If>
          {I18n.t('CALLBACKS.CALLBACKS')}
        </div>

        <div className="CallbacksCalendar__list">
          <Link to="/callbacks/list">
            <i className="fa fa-list" />
          </Link>
        </div>
      </div>
    );
  };

  render() {
    return (
      <CallbacksCalendarComponent
        calendarClassName="CallbacksCalendar__calendar"
        renderTopContent={this.renderTopContent}
      />
    );
  }
}

export default CallbacksCalendar;
