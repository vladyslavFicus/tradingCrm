import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './RemoveButton.scss';

class RemoveButton extends PureComponent {
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
        className={classNames('RemoveButton', className)}
        {...props}
      >
        <i className="RemoveButton__icon icon icon-times" />
      </Button>
    );
  }
}

export default RemoveButton;
