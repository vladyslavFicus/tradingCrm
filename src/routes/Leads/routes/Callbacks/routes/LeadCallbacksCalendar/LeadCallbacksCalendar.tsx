import React from 'react';
import moment from 'moment';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { LeadCallback } from '__generated__/types';
import { Event } from 'constants/calendar';
import { CallbackType } from 'constants/callbacks';
import LeadCallbackDetailsModal from 'modals/LeadCallbackDetailsModal';
import { Link } from 'components/Link';
import Calendar from 'components/Calendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { useLeadCallbacksCalendarQuery } from './graphql/__generated__/LeadCallbacksCalendarQuery';
import './LeadCallbacksCalendar.scss';

type Props = {
  modals: {
    leadCallbackDetailsModal: Modal<{ callbackId: string }>,
  },
}

const LeadCallbacksCalendar = (props: Props) => {
  const { modals: { leadCallbackDetailsModal } } = props;

  const leadCallbacksQuery = useLeadCallbacksCalendarQuery({
    variables: {
      callbackTimeFrom: Calendar.firstVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      callbackTimeTo: Calendar.lastVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      limit: 2000,
    },
  });

  const leadCallbacks = leadCallbacksQuery.data?.leadCallbacks?.content || [];
  const totalElements = leadCallbacksQuery.data?.leadCallbacks?.totalElements || 0;

  const getCalendarEvents = (
    callbacks: Array<LeadCallback>,
  ): Array<Event<LeadCallback>> => callbacks.map(callback => ({
    title: `${moment.utc(callback.callbackTime)
      .local().format('HH:mm')} ${callback.lead && callback.lead.fullName}`,
    start: moment.utc(callback.callbackTime).toDate(),
    end: moment.utc(callback.callbackTime).toDate(),
    callback,
    callbackType: CallbackType.LEAD,
  }));

  const handleRangeChanged = ({ start: callbackTimeFrom, end: callbackTimeTo }: {start: string, end: string}) => {
    leadCallbacksQuery.refetch({ callbackTimeFrom, callbackTimeTo });
  };

  const handleOpenDetailModal = ({ callback: { callbackId } }: Event<LeadCallback>) => {
    leadCallbackDetailsModal.show({ callbackId });
  };

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
        onSelectEvent={handleOpenDetailModal}
        onRangeChange={handleRangeChanged}
      />
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    leadCallbackDetailsModal: LeadCallbackDetailsModal,
  }),
)(LeadCallbacksCalendar);
