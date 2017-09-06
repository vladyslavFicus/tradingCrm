import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import onClickOutside from 'react-onclickoutside';
import Uuid from '../Uuid';
import './FailureReasonIcon.scss';

class FailureReasonIcon extends Component {
  static propTypes = {
    reason: PropTypes.string,
    statusDate: PropTypes.string,
    statusAuthor: PropTypes.string,
  };
  static defaultProps = {
    reason: null,
    statusDate: null,
    statusAuthor: null,
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
    const { statusAuthor, statusDate, reason } = this.props;

    return (
      <Popover
        className="failure-reason-popover"
        placement="right"
        isOpen={this.state.popoverOpen}
        target="failure-reason-icon"
      >
        <PopoverTitle>
          <div className="failure-reason-popover__title">
            {I18n.t('COMMON.AUTHOR_BY')}
            {' '}
            {
              !!statusAuthor &&
              <span className="font-weight-700">
                <Uuid
                  uuid={statusAuthor}
                  uuidPrefix={statusAuthor.indexOf('OPERATOR') === -1 ? 'OP' : null}
                />
              </span>
            }
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
      <div onClick={this.togglePopoverOpen}>
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
