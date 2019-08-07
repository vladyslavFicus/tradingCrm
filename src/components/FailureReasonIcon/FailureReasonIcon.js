import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Uuid from '../Uuid';
import './FailureReasonIcon.scss';

class FailureReasonIcon extends Component {
  static propTypes = {
    reason: PropTypes.string,
    statusDate: PropTypes.string,
    statusAuthor: PropTypes.string,
    id: PropTypes.string,
    profileStatusComment: PropTypes.string,
  };

  static defaultProps = {
    reason: null,
    statusDate: null,
    statusAuthor: null,
    id: 'failure-reason-icon',
    profileStatusComment: '',
  };

  state = {
    popoverOpen: false,
  };

  togglePopoverOpen = () => {
    this.setState(({ popoverOpen }) => ({ popoverOpen: !popoverOpen }));
  };

  renderPopoverContent(id) {
    const {
      statusAuthor,
      statusDate,
      reason,
      profileStatusComment,
    } = this.props;
    const { popoverOpen } = this.state;

    return (
      <Popover
        className="failure-reason-popover"
        placement="right"
        isOpen={popoverOpen}
        target={id}
        toggle={this.togglePopoverOpen}
      >
        <PopoverHeader tag="div" className="failure-reason-popover__header">
          <div className="failure-reason-popover__title">
            {I18n.t('COMMON.AUTHOR_BY')}
            {' '}
            <If condition={!!statusAuthor}>
              <Uuid
                uuid={statusAuthor}
                uuidPrefix={statusAuthor.indexOf('OPERATOR') === -1 ? 'OP' : null}
                className="font-weight-700"
              />
            </If>
          </div>
          <div className="failure-reason-popover__date">
            {statusDate}
          </div>
        </PopoverHeader>
        <PopoverBody className="failure-reason-popover__body">
          <span className="font-weight-700">{I18n.t('COMMON.REASON')}:</span> {I18n.t(reason)}
          <If condition={profileStatusComment}>
            <div>
              <span className="font-weight-700">{I18n.t('COMMON.COMMENT')}:</span> {profileStatusComment}
            </div>
          </If>
        </PopoverBody>
      </Popover>
    );
  }

  render() {
    const { id } = this.props;

    return (
      <Fragment>
        <button
          id={id}
          type="button"
          className="failure-reason-icon"
          onClick={this.togglePopoverOpen}
        />
        {this.renderPopoverContent(id)}
      </Fragment>
    );
  }
}

export default FailureReasonIcon;
