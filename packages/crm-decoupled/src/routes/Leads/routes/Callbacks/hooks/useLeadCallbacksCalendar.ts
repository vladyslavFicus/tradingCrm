import { useCallback } from 'react';
import moment from 'moment';
import { Types, Constants, useModal } from '@crm/common';
import { LeadCallback } from '__generated__/types';
import UpdateLeadCallbackModal, { UpdateLeadCallbackModalProps } from 'modals/UpdateLeadCallbackModal';
import DeleteLeadCallbackModal, { DeleteLeadCallbackModalProps } from 'modals/DeleteLeadCallbackModal';
import useCalendar from 'components/Calendar/hooks/useCalendar';
import { useLeadCallbacksCalendarListQuery } from '../graphql/__generated__/LeadCallbacksCalendarListQuery';

const useLeadCallbacksCalendar = () => {
  const { firstVisibleDate, lastVisibleDate } = useCalendar();

  // ===== Modals ===== //
  const deleteLeadCallbackModal = useModal<DeleteLeadCallbackModalProps>(DeleteLeadCallbackModal);
  const updateLeadCallbackModal = useModal<UpdateLeadCallbackModalProps>(UpdateLeadCallbackModal);

  // ===== Requests ===== //
  const leadCallbacksCalendarListQuery = useLeadCallbacksCalendarListQuery({
    variables: {
      callbackTimeFrom: firstVisibleDate(moment()).utc().format(Constants.DATE_TIME_BASE_FORMAT),
      callbackTimeTo: lastVisibleDate(moment()).utc().format(Constants.DATE_TIME_BASE_FORMAT),
      page: {
        from: 0,
        size: 2000,
      },
    },
  });

  const { data, refetch } = leadCallbacksCalendarListQuery;
  const { content: leadCallbacks = [], totalElements = 0 } = data?.leadCallbacks || {};

  const getCalendarEvents = useCallback((
    callbacks: Array<LeadCallback>,
  ): Array<Types.Event<LeadCallback>> => callbacks.map(callback => ({
    title: `${moment.utc(callback.callbackTime)
      .local().format('HH:mm')} ${callback.lead && callback.lead.fullName}`,
    start: moment.utc(callback.callbackTime).toDate(),
    end: moment.utc(callback.callbackTime).toDate(),
    callback,
    callbackType: Constants.CallbackType.LEAD,
  })), []);

  // ===== Handlers ===== //
  const handleRangeChanged = useCallback((range: Types.Range) => {
    const { start, end } = range;

    refetch({ callbackTimeFrom: String(start), callbackTimeTo: String(end) });
  }, [refetch]);

  const handleCloseUpdateModal = useCallback(() => {
    updateLeadCallbackModal.hide();
    refetch();
  }, [refetch, updateLeadCallbackModal]);

  const handleOpenUpdateModal = useCallback(({ callback }: Types.Event<Types.CommonCallback>) => {
    const { callbackId } = callback;

    updateLeadCallbackModal.show({
      callbackId,
      onDelete: () => deleteLeadCallbackModal.show({
        callback: callback as LeadCallback,
        onSuccess: handleCloseUpdateModal,
      }),
    });
  }, [updateLeadCallbackModal, deleteLeadCallbackModal, handleCloseUpdateModal]);

  return {
    leadCallbacks,
    totalElements,
    getCalendarEvents,
    handleRangeChanged,
    handleOpenUpdateModal,
  };
};

export default useLeadCallbacksCalendar;
