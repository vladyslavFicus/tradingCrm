import React, { useEffect } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { ClientCallback } from '__generated__/types';
import EventEmitter, { CLIENT_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { useModal } from 'providers/ModalProvider';
import { Event } from 'constants/calendar';
import { CallbackType } from 'constants/callbacks';
import UpdateClientCallbackModal, { UpdateClientCallbackModalProps } from 'modals/UpdateClientCallbackModal';
import DeleteClientCallbackModal, { DeleteClientCallbackModalProps } from 'modals/DeleteClientCallbackModal';
import { Link } from 'components/Link';
import Calendar from 'components/Calendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { useClientCallbacksListQuery } from './graphql/__generated__/ClientCallbacksListQuery';
import './ClientCallbacksCalendar.scss';

type Range = {
  start: string,
  end: string,
};

const ClientCallbacksCalendar = () => {
  // ===== Modals ===== //
  const updateClientCallbackModal = useModal<UpdateClientCallbackModalProps>(UpdateClientCallbackModal);
  const deleteClientCallbackModal = useModal<DeleteClientCallbackModalProps>(DeleteClientCallbackModal);

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

    updateClientCallbackModal.show({
      callbackId,
      onDelete: () => deleteClientCallbackModal.show({
        callback,
        onSuccess: updateClientCallbackModal.hide,
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

export default React.memo(ClientCallbacksCalendar);
