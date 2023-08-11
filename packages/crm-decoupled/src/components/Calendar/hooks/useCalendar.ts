import { useCallback } from 'react';
import moment, { Moment } from 'moment';
import { Types, Constants } from '@crm/common';

type VisibleDate = (date: Moment) => Moment;

type BackgroundColor = {
  style: {
    backgroundColor: string,
  },
};

type UseCalendar = {
  firstVisibleDate: VisibleDate,
  lastVisibleDate: VisibleDate,
  handleRangeChange: (range?: Types.Range) => void,
  eventStyleGetter: (callback : { callbackType: Constants.CallbackType }) => BackgroundColor,
};

const useCalendar = (onRangeChange?: (range: Types.Range) => void): UseCalendar => {
  /**
   * Get first visible date in calendar
   * @param date
   * @return {moment.Moment}
   */
  const firstVisibleDate = (date: Moment) => moment(date).startOf('month').startOf('week');

  /**
   * Get las visible date in calendar
   * @param date
   * @return {moment.Moment}
   */
  const lastVisibleDate = (date: Moment) => moment(date).endOf('month').endOf('week');

  /**
   * Handle on range change event
   * @param range
   */
  const handleRangeChange = useCallback((range?: Types.Range) => {
    let rangeObject = {};

    // Convert range to object { start: Moment, end: Moment }
    if (Array.isArray(range)) {
      rangeObject = {
        start: moment(range[0]).startOf('day'),
        end: moment(range[range.length - 1]).endOf('day'),
      };
    } else if (typeof range === 'object' && range.start && range.end) {
      rangeObject = {
        start: moment(range.start).startOf('day'),
        end: moment(range.end).endOf('day'),
      };
    }

    onRangeChange?.(rangeObject as Types.Range);
  }, []);

  /**
   * Custom style for event type
   * @param event
   * @return { style: {} }
   */
  const eventStyleGetter = useCallback(({ callbackType }: { callbackType: Constants.CallbackType }) => {
    const backgroundColor = callbackType === Constants.CallbackType.LEAD
      ? 'var(--state-colors-success)'
      : 'var(--state-colors-info)';
    return { style: { backgroundColor } };
  }, []);

  return {
    firstVisibleDate,
    lastVisibleDate,
    handleRangeChange,
    eventStyleGetter,
  };
};

export default useCalendar;
