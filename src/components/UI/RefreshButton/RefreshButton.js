import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import customTimeout from 'utils/customTimeout';
import { Button } from 'components/UI';
import './RefreshButton.scss';

class RefreshButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    onClick: () => {},
  }

  state = {
    isRunningReloadAnimation: false,
  }

  handleClick = (e) => {
    const { onClick } = this.props;
    const { isRunningReloadAnimation } = this.state;

    if (isRunningReloadAnimation) {
      return;
    }

    this.setState({ isRunningReloadAnimation: true });

    customTimeout(() => {
      this.setState({ isRunningReloadAnimation: false });
    }, 1000);

    onClick(e);
  };

  render() {
    const { className, onClick, ...props } = this.props;
    const { isRunningReloadAnimation } = this.state;

    return (
      <Button
        common
        className={classNames('RefreshButton', className)}
        onClick={this.handleClick}
        {...props}
      >
        <i
          className={classNames(
            'fa fa-refresh RefreshButton__icon',
            { 'RefreshButton__icon--spin': isRunningReloadAnimation },
          )}
        />
      </Button>
    );
  }
}

export default RefreshButton;
