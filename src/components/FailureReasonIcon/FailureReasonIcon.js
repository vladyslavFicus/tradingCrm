import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import onClickOutside from 'react-onclickoutside';
import './FailureReasonIcon.scss';

class FailureReasonIcon extends Component {
  static propTypes = {
    reason: PropTypes.string,
    statusDate: PropTypes.string,
    fullName: PropTypes.string,
  };
  static defaultProps = {
    reason: null,
    statusDate: null,
    fullName: null,
  };
  state = {
    popoverOpen: false,
  };

  togglePopoverOpen = (e) => {
    e.stopPropagation();

    this.setState({ popoverOpen: !this.state.popoverOpen });
  };

  handleClickOutside = () => {
    this.setState({ popoverOpen: false });
  };

  renderPopoverContent() {
    const { fullName, statusDate, reason } = this.props;

    return (
      <Popover
        className="failure-reason-popover"
        placement="right"
        isOpen={this.state.popoverOpen}
        target="failure-reason-icon"
      >
        <PopoverTitle>
          <div className="failure-reason-popover__title">
            {I18n.t('COMMON.AUTHOR_BY')} <strong>{fullName}</strong>
          </div>
          <div className="failure-reason-popover__date">
            {statusDate}
          </div>
        </PopoverTitle>
        <PopoverContent>
          <div className="failure-reason-popover__textfield">
            {reason}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  render() {
    return (
      <div
        onClick={this.togglePopoverOpen}
      >
        <span
          id="failure-reason-icon"
          className="failure-reason-icon failure-reason-icon_account-status"
        />
        {this.renderPopoverContent()}
      </div>
    );
  }
}

export default onClickOutside(FailureReasonIcon);
