import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverBody } from 'reactstrap';
import { types as miniProfileTypes } from '../../constants/miniProfile';
import {
  TransactionMiniProfile,
  OperatorMiniProfile,
  PlayerMiniProfile,
  LeadMiniProfile,
} from '../../components/MiniProfile';

class MiniProfilePopover extends Component {
  static propTypes = {
    placement: PropTypes.string,
    target: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    popoverMouseEvents: PropTypes.shape({
      enter: PropTypes.func.isRequired,
      leave: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    placement: 'right',
    popoverMouseEvents: null,
  };

  renderMiniProfile = () => {
    const { data, type } = this.props;

    switch (type) {
      case miniProfileTypes.TRANSACTION:
        return <TransactionMiniProfile data={data} />;
      case miniProfileTypes.OPERATOR:
        return <OperatorMiniProfile data={data} />;
      case miniProfileTypes.PLAYER:
        return <PlayerMiniProfile data={data} />;
      case miniProfileTypes.LEAD:
        return <LeadMiniProfile data={data} />;
      default:
        return null;
    }
  };

  render() {
    const { placement, target, popoverMouseEvents } = this.props;

    const popoverContent = popoverMouseEvents ?
      (
        <div
          onMouseEnter={popoverMouseEvents.enter}
          onMouseLeave={popoverMouseEvents.leave}
        >
          {this.renderMiniProfile()}
        </div>
      )
      : this.renderMiniProfile();

    return (
      <Popover
        placement={placement}
        isOpen
        target={target}
        className="mini-profile-popover"
        container={target}
        hideArrow
      >
        <PopoverBody>
          {popoverContent}
        </PopoverBody>
      </Popover>
    );
  }
}

export default MiniProfilePopover;
