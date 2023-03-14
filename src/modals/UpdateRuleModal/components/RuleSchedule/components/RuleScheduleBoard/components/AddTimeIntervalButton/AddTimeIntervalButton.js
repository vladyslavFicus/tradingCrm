import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components/Buttons';
import { ReactComponent as PlusIcon } from './plus-icon.svg';
import './AddTimeIntervalButton.scss';

class AddTimeIntervalButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const { className, ...props } = this.props;

    return (
      <Button
        className={classNames('AddTimeIntervalButton', className)}
        contentClassName="AddTimeIntervalButton__content"
        {...props}
      >
        <span>{I18n.t('RULE_MODAL.SCHEDULE.ADD_TIME_INTERVAL_BUTTON')}</span>
        <PlusIcon className="AddTimeIntervalButton__icon" />
      </Button>
    );
  }
}

export default AddTimeIntervalButton;
