import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ClientCallback, LeadCallback } from '__generated__/types';
import { Event } from 'constants/calendar';
import { CallbackType } from 'constants/callbacks';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import Calendar from 'components/Calendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import ClientCallbackDetailsModal, { ClientCallbackDetailsModalProps } from 'modals/ClientCallbackDetailsModal';
import LeadCallbackDetailsModal, { LeadCallbackDetailsModalProps } from 'modals/LeadCallbackDetailsModal';
import DeleteClientCallbackModal, { DeleteClientCallbackModalProps } from 'modals/DeleteClientCallbackModal';
import DeleteLeadCallbackModal, { DeleteLeadCallbackModalProps } from 'modals/DeleteLeadCallbackModal';
import { useClientCallbacksQuery } from './graphql/__generated__/ClientCallbacksQuery';
import { useLeadCallbacksQuery } from './graphql/__generated__/LeadCallbacksQuery';
import './CallbacksCalendar.scss';

type Props = {
  onLockToggle(isLock: boolean): void,
};

type CommonCallback = ClientCallback | LeadCallback;

const CallbacksCalendar = (props: Props) => {
  const { onLockToggle } = props;

  const [callbackTime, setCallbackTime] = useState({
    callbackTimeFrom: Calendar.firstVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
    callbackTimeTo: Calendar.lastVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
  });

  // ===== Modals ===== //
  const clientCallbackDetailsModal = useModal<ClientCallbackDetailsModalProps>(ClientCallbackDetailsModal);
  const leadCallbackDetailsModal = useModal<LeadCallbackDetailsModalProps>(LeadCallbackDetailsModal);
  const deleteClientCallbackModal = useModal<DeleteClientCallbackModalProps>(DeleteClientCallbackModal);
  const deleteLeadCallbackModal = useModal<DeleteLeadCallbackModalProps>(DeleteLeadCallbackModal);

  useEffect(() => {
    onLockToggle(clientCallbackDetailsModal.isOpen || leadCallbackDetailsModal.isOpen);
  }, [clientCallbackDetailsModal.isOpen, leadCallbackDetailsModal.isOpen]);

  const permission = usePermission();

  const clientCallbacksQuery = useClientCallbacksQuery({
    variables: { ...callbackTime, limit: 2000 },
    skip: permission.denies(permissions.USER_PROFILE.CALLBACKS_LIST),
  });

  const leadCallbacksQuery = useLeadCallbacksQuery({
    variables: { ...callbackTime, limit: 2000 },
    skip: permission.denies(permissions.LEAD_PROFILE.CALLBACKS_LIST),
  });

  const clientCallbacks = clientCallbacksQuery?.data?.clientCallbacks?.content || [];
  const leadCallbacks = leadCallbacksQuery?.data?.leadCallbacks.content || [];

  const getEventTitle = (callback: CommonCallback, callbackType: CallbackType): string => {
    const date = moment.utc(callback.callbackTime).local().format('HH:mm');
    if (callbackType === CallbackType.CLIENT) {
      return `${date} ${(callback as ClientCallback).client?.fullName}`;
    }
    return `${date} ${(callback as LeadCallback).lead?.fullName}`;
  };

  const getCalendarEvents = (
    callbacks: Array<CommonCallback>,
    callbackType: CallbackType,
  ): Array<Event<CommonCallback>> => callbacks.map(callback => ({
    title: getEventTitle(callback, callbackType),
    start: moment.utc(callback.callbackTime).toDate(),
    end: moment.utc(callback.callbackTime).toDate(),
    callback,
    callbackType,
  }));

  const handleRangeChanged = ({ start: callbackTimeFrom, end: callbackTimeTo }: {start: string, end: string}) => {
    setCallbackTime({ callbackTimeFrom, callbackTimeTo });
  };

  const handleOpenDetailModal = ({ callback, callbackType }: Event<CommonCallback>) => {
    const { callbackId } = callback;

    if (callbackType === CallbackType.CLIENT) {
      clientCallbackDetailsModal.show({
        callbackId,
        onDelete: () => deleteClientCallbackModal.show({
          callback: callback as ClientCallback,
          onSuccess: clientCallbackDetailsModal.hide,
        }),
      });
    }
    if (callbackType === CallbackType.LEAD) {
      leadCallbackDetailsModal.show({
        callbackId,
        onDelete: () => deleteLeadCallbackModal.show({
          callback: callback as LeadCallback,
          onSuccess: leadCallbackDetailsModal.hide,
        }),
      });
    }
  };

  return (
    <div className="CallbacksCalendar">
      <Calendar
        className="HeaderCalendar__view"
        events={[
          ...getCalendarEvents(clientCallbacks as Array<CommonCallback>, CallbackType.CLIENT),
          ...getCalendarEvents(leadCallbacks as Array<CommonCallback>, CallbackType.LEAD),
        ]}
        onSelectEvent={handleOpenDetailModal}
        onRangeChange={handleRangeChanged}
      />
    </div>
  );
};

export default React.memo(CallbacksCalendar);
