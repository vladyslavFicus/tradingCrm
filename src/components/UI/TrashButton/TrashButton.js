import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './TrashButton.scss';

class TrashButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    disabled: false,
  }

  render() {
    const { className, disabled, ...props } = this.props;

    return (
      <Button
        disabled={disabled}
        className={classNames('TrashButton', { 'TrashButton--disabled': disabled }, className)}
        {...props}
      >
        <i className="TrashButton__icon fa fa-trash" />
      </Button>
    );
  }
}

export default TrashButton;
