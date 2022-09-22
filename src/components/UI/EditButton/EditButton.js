import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import { ReactComponent as EditIcon } from './icon-edit.svg';
import './EditButton.scss';

class EditButton extends PureComponent {
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
        transparent
        disabled={disabled}
        className={classNames('EditButton', { 'EditButton--disabled': disabled }, className)}
        {...props}
      >
        <EditIcon className="EditButton__icon" />
      </Button>
    );
  }
}

export default EditButton;
