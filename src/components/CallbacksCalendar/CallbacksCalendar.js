import React, { PureComponent } from 'react';
import moment from 'moment';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import CallbackDetailsModal from 'modals/CallbackDetailsModal';
import Calendar from '../Calendar';
import CallbacksCalendarQuery from './graphql/CallbacksCalendarQuery';
import './CallbacksCalendar.scss';

class CallbacksCalendar extends PureComponent {
  static propTypes = {
    callbacksQuery: PropTypes.query(PropTypes.pageable(PropTypes.callback)).isRequired,
    modals: PropTypes.shape({
      callbackDetails: PropTypes.modalType,
    }).isRequired,
    calendarClassName: PropTypes.string,
    componentRef: PropTypes.func,
    renderTopContent: PropTypes.func,
  };

  static defaultProps = {
    calendarClassName: null,
    componentRef: () => {},
    renderTopContent: null,
  };

  constructor(props) {
    super(props);
    props.componentRef(this);
  }

  getCalendarEvents = entities => entities.map(callback => ({
    title: `${moment.utc(callback.callbackTime)
      .local().format('HH:mm')} ${callback.client && callback.client.fullName}`,
    start: new Date(callback.callbackTime),
    end: new Date(callback.callbackTime),
    callback,
  }));

  handleRangeChanged = ({ start: callbackTimeFrom, end: callbackTimeTo }) => {
    this.props.callbacksQuery.refetch({ callbackTimeFrom, callbackTimeTo });
  };

  handleOpenDetailModal = ({ callbackId }) => {
    this.props.modals.callbackDetails.show({ callbackId });
  };

  render() {
    const {
      calendarClassName,
      callbacksQuery,
      renderTopContent,
    } = this.props;

    const callbacks = callbacksQuery.data?.callbacks?.content || [];

    return (
      <div className="CallbacksCalendar">
        {renderTopContent && renderTopContent(this.props)}
        <Calendar
          className={calendarClassName}
          events={this.getCalendarEvents(callbacks)}
          onSelectEvent={({ callback }) => this.handleOpenDetailModal(callback)}
          onRangeChange={this.handleRangeChanged}
        />
      </div>
    );
  }
}

export default compose(
  withRequests({
    callbacksQuery: CallbacksCalendarQuery,
  }),
  withModals({
    callbackDetails: CallbackDetailsModal,
  }),
)(CallbacksCalendar);
