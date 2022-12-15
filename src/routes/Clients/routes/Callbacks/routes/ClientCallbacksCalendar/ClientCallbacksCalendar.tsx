import React, { useEffect } from 'react';
import moment from 'moment';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { ClientCallback } from '__generated__/types';
import EventEmitter, { CLIENT_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Event } from 'constants/calendar';
import { CallbackType } from 'constants/callbacks';
import ClientCallbackDetailsModal from 'modals/ClientCallbackDetailsModal';
import DeleteClientCallbackModal from 'modals/DeleteClientCallbackModal';
import { Link } from 'components/Link';
import Calendar from 'components/Calendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { useClientCallbacksListQuery } from './graphql/__generated__/ClientCallbacksListQuery';
import './ClientCallbacksCalendar.scss';

type Range = {
  start: string,
  end: string,
};

type Props = {
  modals: {
    clientCallbackDetailsModal: Modal,
    deleteClientCallbackModal: Modal,
  },
};

const ClientCallbacksCalendar = (props: Props) => {
  const { clientCallbackDetailsModal, deleteClientCallbackModal } = props.modals;

  // ===== Requests ===== //
  const clientCallbacksListQuery = useClientCallbacksListQuery({
    variables: {
      callbackTimeFrom: Calendar.firstVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      callbackTimeTo: Calendar.lastVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      limit: 2000,
    },
  });

  const clientCallbacks = clientCallbacksListQuery.data?.clientCallbacks?.content || [];
  const totalElements = clientCallbacksListQuery.data?.clientCallbacks?.totalElements || 0;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_CALLBACK_RELOAD, clientCallbacksListQuery.refetch);

    return () => {
      EventEmitter.off(CLIENT_CALLBACK_RELOAD, clientCallbacksListQuery.refetch);
    };
  }, []);

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

  // ===== Handlers ===== //
  const handleRangeChanged = (range: Range) => {
    const { start: callbackTimeFrom, end: callbackTimeTo } = range;

    clientCallbacksListQuery.refetch({ callbackTimeFrom, callbackTimeTo });
  };

  const handleOpenDetailModal = ({ callback }: Event<ClientCallback>) => {
    const { callbackId } = callback;

    clientCallbackDetailsModal.show({
      callbackId,
      onDelete: () => deleteClientCallbackModal.show({
        callback,
        onSuccess: clientCallbackDetailsModal.hide,
      }),
    });
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
    deleteClientCallbackModal: DeleteClientCallbackModal,
  }),
)(ClientCallbacksCalendar);
