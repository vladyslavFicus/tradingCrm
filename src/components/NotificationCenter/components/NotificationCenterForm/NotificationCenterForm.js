import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components/UI';
import Select from 'components/Select';
import { notificationCenterTypesLabels } from 'constants/notificationCenter';
import renderLabel from 'utils/renderLabel';
import './NotificationCenterForm.scss';

class NotificationCenterForm extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    notificationsTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static equalSelectedTypes = (a, b) => (
    a.sort().toString() === b.sort().toString()
  );

  state = {
    selectedTypes: [],
    read: '',
  };

  onSubmit = (e) => {
    const { selectedTypes, read } = this.state;

    this.props.onSubmit(selectedTypes, read);
    this.appliedValue = true;

    e.preventDefault();
  };

  onChange = (value) => {
    const selectedTypes = !value ? [] : value;

    this.setState({ selectedTypes });
  };

  onReset = () => {
    this.setState({ selectedTypes: [], read: '' }, () => {
      if (this.appliedValue) {
        this.props.onSubmit([]);
      }
      this.appliedValue = false;
    });
  };

  render() {
    const { className, notificationsTypes } = this.props;
    const { selectedTypes, read } = this.state;

    return (
      <form
        className={classNames('NotificationCenterForm', className)}
        onSubmit={this.onSubmit}
      >
        <div className="NotificationCenterForm__field">
          <div className="NotificationCenterForm__label">
            {I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE')}
          </div>
          <Select
            value={selectedTypes}
            onChange={this.onChange}
            multiple
            showSearch
          >
            {notificationsTypes.map(value => (
              <option key={value} value={value}>
                {I18n.t(renderLabel(value, notificationCenterTypesLabels))}
              </option>
            ))}
          </Select>
        </div>
        <div className="NotificationCenterForm__field">
          <div className="NotificationCenterForm__label">
            {I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.READ_UNREAD')}
          </div>
          <Select
            value={read}
            onChange={value => this.setState({ read: value })}
          >
            <option key={3} value={null}>
              {I18n.t('COMMON.ANY')}
            </option>
            <option key={2} value={0}>
              {I18n.t('NOTIFICATION_CENTER.FILTERS.UNREAD')}
            </option>
            <option key={1} value={1}>
              {I18n.t('NOTIFICATION_CENTER.FILTERS.READ')}
            </option>
          </Select>
        </div>
        <div className="NotificationCenterForm__button-group">
          <Button
            className="NotificationCenterForm__button"
            onClick={this.onReset}
            disabled={!selectedTypes.length && !Number.isInteger(read)}
            common
          >
            {I18n.t('COMMON.RESET')}
          </Button>
          <Button
            className="NotificationCenterForm__button"
            type="submit"
            primary
          >
            {I18n.t('COMMON.APPLY')}
          </Button>
        </div>
      </form>
    );
  }
}

export default NotificationCenterForm;
