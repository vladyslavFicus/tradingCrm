import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/Buttons';
import { ReactComponent as CloseIcon } from './close-icon.svg';
import './RemoveBoardButton.scss';

class RemoveBoardButton extends PureComponent {
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
        className={classNames('RemoveBoardButton', className)}
        onClick={onClick}
        disabled={!onClick}
        {...props}
      >
        <CloseIcon className="RemoveBoardButton__icon" />
      </Button>
    );
  }
}

export default RemoveBoardButton;
