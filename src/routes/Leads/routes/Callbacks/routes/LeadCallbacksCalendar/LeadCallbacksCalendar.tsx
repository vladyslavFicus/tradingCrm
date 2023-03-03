import React, { useEffect } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { LeadCallback } from '__generated__/types';
import EventEmitter, { LEAD_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { useModal } from 'providers/ModalProvider';
import { Event } from 'constants/calendar';
import { CallbackType } from 'constants/callbacks';
import UpdateLeadCallbackModal, { UpdateLeadCallbackModalProps } from 'modals/UpdateLeadCallbackModal';
import DeleteLeadCallbackModal, { DeleteLeadCallbackModalProps } from 'modals/DeleteLeadCallbackModal';
import { Link } from 'components/Link';
import Calendar from 'components/Calendar';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { useLeadCallbacksListQuery } from './graphql/__generated__/LeadCallbacksListQuery';
import './LeadCallbacksCalendar.scss';

type Range = {
  start: string,
  end: string,
};

const LeadCallbacksCalendar = () => {
  // ===== Modals ===== //
  const deleteLeadCallbackModal = useModal<DeleteLeadCallbackModalProps>(DeleteLeadCallbackModal);
  const updateLeadCallbackModal = useModal<UpdateLeadCallbackModalProps>(UpdateLeadCallbackModal);

  // ===== Requests ===== //
  const leadCallbacksListQuery = useLeadCallbacksListQuery({
    variables: {
      callbackTimeFrom: Calendar.firstVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      callbackTimeTo: Calendar.lastVisibleDate(moment()).utc().format(DATE_TIME_BASE_FORMAT),
      limit: 2000,
    },
  });

  const leadCallbacks = leadCallbacksListQuery.data?.leadCallbacks?.content || [];
  const totalElements = leadCallbacksListQuery.data?.leadCallbacks?.totalElements || 0;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);

    return () => {
      EventEmitter.off(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);
    };
  }, []);

  const getCalendarEvents = (
    callbacks: Array<LeadCallback>,
  ): Array<Event<LeadCallback>> => callbacks.map(callback => ({
    title: `${moment.utc(callback.callbackTime)
      .local().format('HH:mm')} ${callback.lead && callback.lead.fullName}`,
    start: moment.utc(callback.callbackTime).toDate(),
    end: moment.utc(callback.callbackTime).toDate(),
    callback,
    callbackType: CallbackType.LEAD,
  }));

  // ===== Handlers ===== //
  const handleRangeChanged = (range: Range) => {
    const { start: callbackTimeFrom, end: callbackTimeTo } = range;

    leadCallbacksListQuery.refetch({ callbackTimeFrom, callbackTimeTo });
  };

  const handleOpenDetailModal = ({ callback }: Event<LeadCallback>) => {
    const { callbackId } = callback;

    updateLeadCallbackModal.show({
      callbackId,
      onDelete: () => deleteLeadCallbackModal.show({
        callback,
        onSuccess: updateLeadCallbackModal.hide,
      }),
    });
  };

  return (
    <div className="CallbacksCalendar">
      <div className="LeadCallbacksCalendar__header">
        <div className="LeadCallbacksCalendar__title">
          <If condition={!!totalElements}>
            <strong>{totalElements} </strong>
          </If>

          {I18n.t('CALLBACKS.CALLBACKS')}
        </div>

        <div className="LeadCallbacksCalendar__list">
          <Link to="/leads/callbacks/list">
            <i className="fa fa-list" />
          </Link>
        </div>
      </div>

      <Calendar
        className="LeadCallbacksCalendar__calendar"
        events={getCalendarEvents(leadCallbacks as Array<LeadCallback>)}
        onSelectEvent={handleOpenDetailModal}
        onRangeChange={handleRangeChanged}
      />
    </div>
  );
};

export default React.memo(LeadCallbacksCalendar);
