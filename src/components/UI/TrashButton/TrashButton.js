import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './TrashButton.scss';

class TrashButton extends PureComponent {
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
        className={classNames('TrashButton', className)}
        {...props}
      >
        <i className="TrashButton__icon fa fa-trash" />
      </Button>
    );
  }
}

export default TrashButton;
