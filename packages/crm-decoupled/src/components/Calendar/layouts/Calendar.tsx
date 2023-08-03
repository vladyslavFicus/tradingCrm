import React from 'react';
import moment from 'moment';
import {
  Calendar as BigCalendar,
  Views,
  momentLocalizer,
} from '@hrzn/react-big-calendar';
import { CommonCallback } from 'types/common';
import { Event, Range } from 'constants/calendar';
import useCalendar from 'components/Calendar/hooks/useCalendar';
import Toolbar from './components/Toolbar';
import '@hrzn/react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

type Props = {
  onRangeChange?: (range: Range) => void,
  className: string,
  events: Array<Event<CommonCallback>>,
  onSelectEvent: (event: Event<CommonCallback>) => void,
};

const Calendar = (props: Props) => {
  const { onRangeChange } = props;

  const {
    handleRangeChange,
    eventStyleGetter,
  } = useCalendar(onRangeChange);

  return (
    <BigCalendar
      popup
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      localizer={localizer}
      components={{ toolbar: Toolbar }}
      {...props}
      onRangeChange={handleRangeChange}
      eventPropGetter={(eventStyleGetter)}
    />
  );
};

export default React.memo(Calendar);
