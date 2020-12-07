import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import { ReactComponent as MinusIcon } from './minus-icon.svg';
import './RemoveTimeIntervalButton.scss';

class RemoveTimeIntervalButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    onClick: null,
  }

  render() {
    const { className, onClick, ...props } = this.props;

    return (
      <Button
        className={classNames('RemoveTimeIntervalButton', className)}
        onClick={onClick}
        disabled={!onClick}
        {...props}
      >
        <MinusIcon className="RemoveTimeIntervalButton__icon" />
      </Button>
    );
  }
}

export default RemoveTimeIntervalButton;
