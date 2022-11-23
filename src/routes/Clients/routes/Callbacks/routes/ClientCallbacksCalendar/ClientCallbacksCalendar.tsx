import React from 'react';
import moment from 'moment';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { ClientCallback } from '__generated__/types';
import { Event } from 'constants/calendar';
import { CallbackType } from 'constants/callbacks';
import ClientCallbackDetailsModal from 'modals/ClientCallbackDetailsModal';
import { Link } from 'components/Link';
import Calendar from 'components/Calendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { useClientCallbacksCalendarQuery } from './graphql/__generated__/ClientCallbacksCalendarQuery';
import './ClientCallbacksCalendar.scss';

type Props = {
  modals: {
    clientCallbackDetailsModal: Modal<{ callbackId: string }>
  }
}

const ClientCallbacksCalendar = (props: Props) => {
  const { modals: { clientCallbackDetailsModal } } = props;

  const clientCallbacksQuery = useClientCallbacksCalendarQuery({
    variables: {
      callbackTimeFrom: Calendar.firstVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      callbackTimeTo: Calendar.lastVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      limit: 2000,
    },
  });

  const clientCallbacks = clientCallbacksQuery.data?.clientCallbacks?.content || [];
  const totalElements = clientCallbacksQuery.data?.clientCallbacks?.totalElements || 0;

  const getCalendarEvents = (
    callbacks: Array<ClientCallback>,
  ): Array<Event<ClientCallback>> => callbacks.map(callback => ({
    title: `${moment.utc(callback.callbackTime)
      .local().format('HH:mm')} ${callback.client && callback.client.fullName}`,
    start: moment.utc(callback.callbackTime).toDate(),
    end: moment.utc(callback.callbackTime).toDate(),
    callback,
    callbackType: CallbackType.CLIENT,
  }));

  const handleRangeChanged = ({ start: callbackTimeFrom, end: callbackTimeTo }: {start: string, end: string}) => {
    clientCallbacksQuery.refetch({ callbackTimeFrom, callbackTimeTo });
  };

  const handleOpenDetailModal = ({ callback: { callbackId } }: Event<ClientCallback>) => {
    clientCallbackDetailsModal.show({ callbackId });
  };

  return (
    <div className="CallbacksCalendar">
      <div className="ClientCallbacksCalendar__header">
        <div className="ClientCallbacksCalendar__title">
          <If condition={!!totalElements}>
            <strong>{totalElements} </strong>
          </If>
          {I18n.t('CALLBACKS.CALLBACKS')}
        </div>
        <div className="ClientCallbacksCalendar__list">
          <Link to="/clients/callbacks/list">
            <i className="fa fa-list" />
          </Link>
        </div>
      </div>
      <Calendar
        className="ClientCallbacksCalendar__calendar"
        events={getCalendarEvents(clientCallbacks as Array<ClientCallback>)}
        onSelectEvent={handleOpenDetailModal}
        onRangeChange={handleRangeChanged}
      />
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    clientCallbackDetailsModal: ClientCallbackDetailsModal,
  }),
)(ClientCallbacksCalendar);
