import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import onClickOutside from 'react-onclickoutside';
import moment from 'moment';

class FailureReasonIcon extends Component {
  static propTypes = {
    reason: PropTypes.string,
    endDate: PropTypes.string,
  };
  static defaultProps = {
    reason: null,
    endDate: null,
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

  renderPopoverContent = (reason, endDate) => {
    return (
      <Popover placement="right" isOpen={this.state.popoverOpen} target="failure-reason-icon">
        <PopoverTitle>
          {
            !!reason &&
            <div className="header-block-small">
              by {reason}
            </div>
          }
        </PopoverTitle>
        <PopoverContent>
          {
            !!endDate &&
            <div className="header-block-small">
              Until {moment(endDate).format('L')}
            </div>
          }
        </PopoverContent>
      </Popover>
    );
  };

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
