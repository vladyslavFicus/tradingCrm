import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import { ReactComponent as CrossIcon } from './icon-cross.svg';
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
        <CrossIcon className="RemoveButton__icon" />
      </Button>
    );
  }
}

export default RemoveButton;
