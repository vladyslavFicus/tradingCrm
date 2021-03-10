import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import { ReactComponent as EditIcon } from './icon-edit.svg';
import './EditButton.scss';

class EditButton extends PureComponent {
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
        transparent
        className={classNames('EditButton', className)}
        {...props}
      >
        <EditIcon className="EditButton__icon" />
      </Button>
    );
  }
}

export default EditButton;
