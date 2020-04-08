import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components/UI';
import Select from 'components/Select';
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
    pristine: true,
  };

  onSubmit = (e) => {
    const { selectedTypes } = this.state;

    this.props.onSubmit(selectedTypes);
    this.setState({ pristine: true });
    this.appliedTypes = selectedTypes;

    e.preventDefault();
  };

  onChange = (value) => {
    const selectedTypes = !value ? [] : value;

    const pristine = NotificationCenterForm.equalSelectedTypes(
      selectedTypes,
      this.appliedTypes || [],
    );

    this.setState({ selectedTypes, pristine });
  };

  onReset = () => {
    this.setState({ selectedTypes: [], pristine: true }, () => {
      if (this.appliedTypes && this.appliedTypes.length) {
        this.props.onSubmit([]);
      }
      this.appliedTypes = [];
    });
  };

  render() {
    const { className, notificationsTypes } = this.props;
    const { selectedTypes, pristine } = this.state;

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
                {value[0] + value.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
        <div className="NotificationCenterForm__button-group">
          <Button
            className="NotificationCenterForm__button"
            onClick={this.onReset}
            disabled={pristine && !selectedTypes.length}
            common
          >
            {I18n.t('COMMON.RESET')}
          </Button>
          <Button
            className="NotificationCenterForm__button"
            type="submit"
            disabled={pristine}
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
