import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { CommonCallback } from 'types/common';
import useCalendar from 'components/Calendar/hooks/useCalendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { Event } from 'constants/calendar';
import { ClientCallback, LeadCallback } from '__generated__/types';
import { CallbackType } from 'constants/callbacks';
import DeleteClientCallbackModal, { DeleteClientCallbackModalProps } from 'modals/DeleteClientCallbackModal';
import DeleteLeadCallbackModal, { DeleteLeadCallbackModalProps } from 'modals/DeleteLeadCallbackModal';
import UpdateClientCallbackModal, { UpdateClientCallbackModalProps } from 'modals/UpdateClientCallbackModal';
import UpdateLeadCallbackModal, { UpdateLeadCallbackModalProps } from 'modals/UpdateLeadCallbackModal';
import { useModal } from 'providers/ModalProvider';
import { useClientCallbacksQuery } from '../graphql/__generated__/ClientCallbacksQuery';
import { useLeadCallbacksQuery } from '../graphql/__generated__/LeadCallbacksQuery';

type Props = {
  onLockToggle(isLock: boolean): void,
};

const useCallbacksCalendar = (props: Props) => {
  const { onLockToggle } = props;

  const { firstVisibleDate, lastVisibleDate } = useCalendar();

  const [callbackTime, setCallbackTime] = useState({
    callbackTimeFrom: firstVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
    callbackTimeTo: lastVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
  });

  // ===== Modals ===== //
  const updateClientCallbackModal = useModal<UpdateClientCallbackModalProps>(UpdateClientCallbackModal);
  const updateLeadCallbackModal = useModal<UpdateLeadCallbackModalProps>(UpdateLeadCallbackModal);
  const deleteClientCallbackModal = useModal<DeleteClientCallbackModalProps>(DeleteClientCallbackModal);
  const deleteLeadCallbackModal = useModal<DeleteLeadCallbackModalProps>(DeleteLeadCallbackModal);

  useEffect(() => {
    onLockToggle(updateClientCallbackModal.isOpen || updateLeadCallbackModal.isOpen);
  }, [updateClientCallbackModal.isOpen, updateLeadCallbackModal.isOpen]);

  const permission = usePermission();

  const clientCallbacksQuery = useClientCallbacksQuery({
    variables: { ...callbackTime, page: { from: 0, size: 2000 } },
    skip: permission.denies(permissions.USER_PROFILE.CALLBACKS_LIST),
  });

  const leadCallbacksQuery = useLeadCallbacksQuery({
    variables: { ...callbackTime, page: { from: 0, size: 2000 } },
    skip: permission.denies(permissions.LEAD_PROFILE.CALLBACKS_LIST),
  });

  const clientCallbacks = clientCallbacksQuery?.data?.clientCallbacks?.content || [] as Array<CommonCallback>;
  const leadCallbacks = leadCallbacksQuery?.data?.leadCallbacks.content || [] as Array<CommonCallback>;

  const getEventTitle = useCallback((
    callback: CommonCallback,
    callbackType: CallbackType,
  ): string => {
    const date = moment.utc(callback?.callbackTime).local().format('HH:mm');
    if (callbackType === CallbackType.CLIENT) {
      return `${date} ${(callback as ClientCallback).client?.fullName}`;
    }
    return `${date} ${(callback as LeadCallback).lead?.fullName}`;
  }, []);

  const getCalendarEvents = useCallback((
    callbacks: Array<CommonCallback>,
    callbackType: CallbackType,
  ): Array<Event<CommonCallback>> => callbacks.map(callback => ({
    title: getEventTitle(callback, callbackType),
    start: moment.utc(callback.callbackTime).toDate(),
    end: moment.utc(callback.callbackTime).toDate(),
    callback,
    callbackType,
  })), []);

  const events = [
    ...getCalendarEvents(clientCallbacks as Array<ClientCallback>, CallbackType.CLIENT),
    ...getCalendarEvents(leadCallbacks as Array<LeadCallback>, CallbackType.LEAD),
  ];

  const handleRangeChanged = useCallback(({
    start: callbackTimeFrom,
    end: callbackTimeTo,
  }) => {
    setCallbackTime({ callbackTimeFrom, callbackTimeTo });
  }, []);

  const handleOpenDetailModal = useCallback(({ callback, callbackType }: Event<CommonCallback>) => {
    const { callbackId } = callback;

    if (callbackType === CallbackType.CLIENT) {
      updateClientCallbackModal.show({
        callbackId,
        onClose: updateClientCallbackModal.hide,
        onDelete: () => {
          deleteClientCallbackModal.show({
            callback: callback as ClientCallback,
            onSuccess: () => {
              updateClientCallbackModal.hide();
              clientCallbacksQuery.refetch();
            },
          });
        },
      });
    }
    if (callbackType === CallbackType.LEAD) {
      updateLeadCallbackModal.show({
        callbackId,
        onClose: updateLeadCallbackModal.hide,
        onDelete: () => {
          deleteLeadCallbackModal.show({
            callback: callback as LeadCallback,
            onSuccess: () => {
              updateLeadCallbackModal.hide();
              leadCallbacksQuery.refetch();
            },
          });
        },
      });
    }
  }, []);

  return { events, handleRangeChanged, handleOpenDetailModal };
};

export default useCallbacksCalendar;
