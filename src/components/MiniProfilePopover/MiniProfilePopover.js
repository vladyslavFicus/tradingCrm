import React, { Component, PropTypes } from 'react';
import { Popover, PopoverContent } from 'reactstrap';
import { types as miniProfileTypes } from '../../constants/miniProfile';
import {
  TransactionMiniProfile,
  OperatorMiniProfile,
  PlayerMiniProfile,
} from '../../components/MiniProfile';

class MiniProfilePopover extends Component {
  static propTypes = {
    placement: PropTypes.string,
    target: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {
    placement: 'right',
  }

  renderMiniProfile = () => {
    const { data, type } = this.props;

    switch (type) {
      case miniProfileTypes.TRANSACTION:
        return <TransactionMiniProfile data={data} />;
      case miniProfileTypes.OPERATOR:
        return <OperatorMiniProfile data={data} />;
      case miniProfileTypes.PLAYER:
        return <PlayerMiniProfile data={data} />;
      default:
        return null;
    }
  }

  render() {
    const { placement, target, toggle } = this.props;

    return (
      <Popover
        placement={placement}
        isOpen
        toggle={toggle}
        target={target}
        className="mini-profile-popover"
      >
        <PopoverContent>
          {this.renderMiniProfile()}
        </PopoverContent>
      </Popover>
    );
  }
}

export default MiniProfilePopover;
