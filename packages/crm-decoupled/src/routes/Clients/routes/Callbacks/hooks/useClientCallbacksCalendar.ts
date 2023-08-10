import { useCallback } from 'react';
import moment from 'moment';
import { useModal } from '@crm/common';
import { ClientCallback } from '__generated__/types';
import { CommonCallback } from 'types/common';
import UpdateClientCallbackModal, { UpdateClientCallbackModalProps } from 'modals/UpdateClientCallbackModal';
import DeleteClientCallbackModal, { DeleteClientCallbackModalProps } from 'modals/DeleteClientCallbackModal';
import useCalendar from 'components/Calendar/hooks/useCalendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { CallbackType } from 'constants/callbacks';
import { Event, Range } from 'constants/calendar';
import { useClientCallbacksCalendarListQuery } from '../graphql/__generated__/ClientCallbacksCalendarListQuery';

const useClientCallbacksCalendar = () => {
  const { firstVisibleDate, lastVisibleDate } = useCalendar();

  // ===== Modals ===== //
  const updateClientCallbackModal = useModal<UpdateClientCallbackModalProps>(UpdateClientCallbackModal);
  const deleteClientCallbackModal = useModal<DeleteClientCallbackModalProps>(DeleteClientCallbackModal);

  // ===== Requests ===== //
  const clientCallbacksCalendarListQuery = useClientCallbacksCalendarListQuery({
    variables: {
      callbackTimeFrom: firstVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      callbackTimeTo: lastVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      page: {
        from: 0,
        size: 2000,
      },
    },
  });

  const { data, refetch } = clientCallbacksCalendarListQuery;

  const clientCallbacks = data?.clientCallbacks?.content || [];
  const totalElements = data?.clientCallbacks?.totalElements || 0;

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
  const handleRangeChanged = useCallback((range: Range) => {
    const { start, end } = range;

    refetch({ callbackTimeFrom: String(start), callbackTimeTo: String(end) });
  }, [refetch]);

  const handleCloseUpdateModal = useCallback(() => {
    updateClientCallbackModal.hide();
    refetch();
  }, [updateClientCallbackModal, refetch]);

  const handleOpenUpdateModal = useCallback(({ callback }: Event<CommonCallback>) => {
    const { callbackId } = callback;

    updateClientCallbackModal.show({
      callbackId,
      onDelete: () => deleteClientCallbackModal.show({
        callback: callback as ClientCallback,
        onSuccess: handleCloseUpdateModal,
      }),
    });
  }, [deleteClientCallbackModal, updateClientCallbackModal, handleCloseUpdateModal]);

  return {
    clientCallbacks,
    totalElements,
    getCalendarEvents,
    handleOpenUpdateModal,
    handleRangeChanged,
  };
};

export default useClientCallbacksCalendar;
