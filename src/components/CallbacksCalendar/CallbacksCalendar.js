import React, { PureComponent } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';
import Calendar from '../Calendar';
import './CallbacksCalendar.scss';

class CallbacksCalendar extends PureComponent {
  static propTypes = {
    callbacks: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      callbacks: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.callback),
      }),
    }).isRequired,
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
    title: `${moment(callback.callbackTime).format('HH:mm')} ${callback.client.fullName}`,
    start: new Date(callback.callbackTime),
    end: new Date(callback.callbackTime),
    callback,
  }));

  handleRangeChanged = ({ start: callbackTimeFrom, end: callbackTimeTo }) => {
    this.props.callbacks.refetch({ callbackTimeFrom, callbackTimeTo });
  };

  handleOpenDetailModal = ({ callbackId }) => {
    this.props.modals.callbackDetails.show({ callbackId });
  };

  render() {
    const {
      calendarClassName,
      callbacks,
      renderTopContent,
    } = this.props;

    const entities = get(callbacks, 'callbacks.data') || { content: [] };

    return (
      <div className="CallbacksCalendar">
        {renderTopContent && renderTopContent(this.props)}
        <Calendar
          className={calendarClassName}
          events={this.getCalendarEvents(entities.content)}
          onSelectEvent={({ callback }) => this.handleOpenDetailModal(callback)}
          onRangeChange={this.handleRangeChanged}
        />
      </div>
    );
  }
}

export default CallbacksCalendar;
