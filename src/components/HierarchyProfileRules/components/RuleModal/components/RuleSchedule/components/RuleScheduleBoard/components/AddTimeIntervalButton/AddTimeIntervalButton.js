import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
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
        {...props}
      >
        <span>Add Time Interval</span>
        <PlusIcon className="AddTimeIntervalButton__icon" />
      </Button>
    );
  }
}

export default AddTimeIntervalButton;
