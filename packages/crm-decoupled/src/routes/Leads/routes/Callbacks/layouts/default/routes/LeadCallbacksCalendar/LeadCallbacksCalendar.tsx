import React from 'react';
import I18n from 'i18n-js';
import { LeadCallback } from '__generated__/types';
import Link from 'components/Link';
import Calendar from 'components/Calendar';
import useLeadCallbacksCalendar from 'routes/Leads/routes/Callbacks/hooks/useLeadCallbacksCalendar';
import './LeadCallbacksCalendar.scss';

const LeadCallbacksCalendar = () => {
  const {
    leadCallbacks,
    totalElements,
    getCalendarEvents,
    handleRangeChanged,
    handleOpenUpdateModal,
  } = useLeadCallbacksCalendar();

  return (
    <div className="CallbacksCalendar">
      <div className="LeadCallbacksCalendar__header">
        <div className="LeadCallbacksCalendar__title">
          <If condition={!!totalElements}>
            <strong>{totalElements} </strong>
          </If>

          {I18n.t('CALLBACKS.CALLBACKS')}
        </div>

        <div className="LeadCallbacksCalendar__list">
          <Link to="/leads/callbacks/list">
            <i className="fa fa-list" />
          </Link>
        </div>
      </div>

      <Calendar
        className="LeadCallbacksCalendar__calendar"
        events={getCalendarEvents(leadCallbacks as Array<LeadCallback>)}
        onSelectEvent={handleOpenUpdateModal}
        onRangeChange={handleRangeChanged}
      />
    </div>
  );
};

export default React.memo(LeadCallbacksCalendar);
