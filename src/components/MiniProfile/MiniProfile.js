import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverBody } from 'reactstrap';
import OperatorMiniProfile from './OperatorMiniProfile';
import LeadMiniProfile from './LeadMiniProfile';
import PlayerMiniProfile from './PlayerMiniProfile';
import './MiniProfile.scss';

class MiniProfile extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placement: PropTypes.string,
  };

  static defaultProps = {
    placement: 'right',
  };

  state = {
    isHovered: false,
  };

  setHover = (isHovered) => {
    this.setState({
      isHovered,
    });
  };

  onMouseOver = () => {
    if (this.hideTimeout) {
      this.clearHideTimeout();
    }

    this.showTimeout = setTimeout(() => this.setHover(true), 500);
  };

  onMouseOut = () => {
    if (this.showTimeout) {
      this.clearShowTimeout();
    }
    this.hideTimeout = setTimeout(() => this.setHover(false), 500);
  };

  popoverView = () => {
    const { type, id } = this.props;

    switch (type) {
      case 'operator':
        return <OperatorMiniProfile uuid={id} />;
      case 'lead':
        return <LeadMiniProfile leadId={id} />;
      case 'player':
        return <PlayerMiniProfile playerUUID={id} />;
      default:
        return null;
    }
  };

  clearShowTimeout() {
    clearTimeout(this.showTimeout);
    this.showTimeout = null;
  }

  clearHideTimeout() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = null;
  }

  render() {
    const { isHovered } = this.state;
    const { children, placement } = this.props;

    return (
      <span
        className="d-inline-block"
        ref={(node) => {
          this.target = node;
        }}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onClick={e => e.stopPropagation()}
      >
        {isHovered && (
          <Popover
            placement={placement}
            isOpen
            target={this.target}
            className="mini-profile-popover"
            container={this.target}
            hideArrow
          >
            <PopoverBody>{this.popoverView()}</PopoverBody>
          </Popover>
        )}
        {children}
      </span>
    );
  }
}

export default MiniProfile;
