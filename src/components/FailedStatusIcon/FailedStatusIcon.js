import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

class FailedStatusIcon extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    showTimeout: PropTypes.number,
    hideTimeout: PropTypes.number,
    iconClassName: PropTypes.string,
    onOpen: PropTypes.func,
  };

  static defaultProps = {
    iconClassName: 'transaction-failed-icon',
    showTimeout: 350,
    hideTimeout: 250,
    onOpen: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
  }

  toggle = () => {
    if (this.props.onOpen && !this.state.tooltipOpen) {
      this.props.onOpen();
    }
    this.setState(({ tooltipOpen }) => ({
      tooltipOpen: !tooltipOpen,
    }));
  };

  render() {
    const { id, children, showTimeout, hideTimeout, iconClassName } = this.props;
    return (
      <span className="failed-status-icon">
        <i id={id} className={iconClassName} />
        <Tooltip
          placement="bottom"
          target={id}
          isOpen={this.state.tooltipOpen}
          delay={{ show: showTimeout, hide: hideTimeout }}
          toggle={this.toggle}
        >
          {children}
        </Tooltip>
      </span>
    );
  }
}

export default FailedStatusIcon;
