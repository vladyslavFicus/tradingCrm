import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import onClickOutside from 'react-onclickoutside';
import './FailureReasonIcon.scss';

class FailureReasonIcon extends Component {
  static propTypes = {
    reason: PropTypes.string,
  };
  static defaultProps = {
    reason: null,
  };
  state = {
    popoverOpen: false,
  };

  togglePopoverOpen = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  };
  handleClickOutside = () => {
    this.setState({ popoverOpen: false });
  };

  renderPopoverContent() {
    return (
      <Popover
        className="failure-reason-popover"
        placement="right"
        isOpen={this.state.popoverOpen}
        target="failure-reason-icon"
      >
        <PopoverTitle>
          <div className="failure-reason-popover__title">
            by <strong>Helen Casssar</strong> - OP-777h1634
          </div>
          <div className="failure-reason-popover__date">
            2016-10-20 17:20:07
          </div>
        </PopoverTitle>
        <PopoverContent>
          <div className="failure-reason-popover__textfield">
            Full text of the reason will be displayed here. You can`t edit bla bla bl
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  render() {
    const { reason } = this.props;

    return (
      <div
        onClick={this.togglePopoverOpen}
      >
        <span
          id="failure-reason-icon"
          className="failure-reason-icon failure-reason-icon_account-status"
        />
        {this.renderPopoverContent(reason)}
      </div>
    );
  }
}

export default onClickOutside(FailureReasonIcon);
