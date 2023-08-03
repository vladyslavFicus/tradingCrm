import React from 'react';
import Calendar from 'components/Calendar';
import useCallbacksCalendar from 'components/Header/hooks/useCallbacksCalendar';
import './CallbacksCalendar.scss';

type Props = {
  onLockToggle(isLock: boolean): void,
};

const CallbacksCalendar = (props: Props) => {
  const { onLockToggle } = props;

  const {
    events,
    handleRangeChanged,
    handleOpenDetailModal,
  } = useCallbacksCalendar({ onLockToggle });

  return (
    <div className="CallbacksCalendar">
      <Calendar
        className="HeaderCalendar__view"
        events={events}
        onSelectEvent={handleOpenDetailModal}
        onRangeChange={handleRangeChanged}
      />
    </div>
  );
};

export default React.memo(CallbacksCalendar);
