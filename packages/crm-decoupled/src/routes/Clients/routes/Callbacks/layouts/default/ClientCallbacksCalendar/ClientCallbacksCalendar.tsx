import React from 'react';
import { ClientCallback } from '__generated__/types';
import Calendar from 'components/Calendar';
import useClientCallbacksCalendar from 'routes/Clients/routes/Callbacks/hooks/useClientCallbacksCalendar';
import ClientCallbacksCalendarHeader from './components/ClientCallbacksCalendarHeader';
import './ClientCallbacksCalendar.scss';

const ClientCallbacksCalendar = () => {
  const {
    clientCallbacks,
    totalElements,
    getCalendarEvents,
    handleOpenUpdateModal,
    handleRangeChanged,
  } = useClientCallbacksCalendar();

  return (
    <div className="ClientCallbacksCalendar">
      <ClientCallbacksCalendarHeader totalElements={totalElements} />

      <Calendar
        className="ClientCallbacksCalendar__calendar"
        events={getCalendarEvents(clientCallbacks as Array<ClientCallback>)}
        onSelectEvent={handleOpenUpdateModal}
        onRangeChange={handleRangeChanged}
      />
    </div>
  );
};

export default React.memo(ClientCallbacksCalendar);
