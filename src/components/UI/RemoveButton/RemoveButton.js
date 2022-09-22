import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './RemoveButton.scss';

class RemoveButton extends PureComponent {
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
        className={classNames('RemoveButton', { 'RemoveButton--disabled': disabled }, className)}
        {...props}
      >
        <i className="RemoveButton__icon icon icon-times" />
      </Button>
    );
  }
}

export default RemoveButton;
