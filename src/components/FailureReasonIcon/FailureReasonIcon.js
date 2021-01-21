import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Uuid from 'components/Uuid';
import './FailureReasonIcon.scss';

class FailureReasonIcon extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    reason: PropTypes.string,
    statusDate: PropTypes.string,
    statusAuthor: PropTypes.string,
    profileStatusComment: PropTypes.string,
  };

  static defaultProps = {
    id: 'failure-reason-id',
    reason: null,
    statusDate: null,
    statusAuthor: null,
    profileStatusComment: '',
  };

  state = {
    isOpenPopover: false,
  }

  handleTogglePopover = () => {
    this.setState(({ isOpenPopover }) => ({ isOpenPopover: !isOpenPopover }));
  };

  render() {
    const {
      id,
      reason,
      statusDate,
      statusAuthor,
      profileStatusComment,
    } = this.props;

    const { isOpenPopover } = this.state;

    return (
      <>
        <button
          id={id}
          type="button"
          className="FailureReasonIcon"
          onClick={this.handleTogglePopover}
        />

        <Popover
          className="FailureReasonIcon__popover"
          placement="right"
          isOpen={isOpenPopover}
          target={id}
          toggle={this.handleTogglePopover}
          trigger="legacy"
        >
          <PopoverHeader tag="div" className="FailureReasonIcon__popover-header">
            <div className="FailureReasonIcon__popover-title">
              {I18n.t('COMMON.AUTHOR_BY')}

              <If condition={statusAuthor}>
                {' '}
                <Uuid
                  uuid={statusAuthor}
                  uuidPrefix="OP"
                  className="FailureReasonIcon__popover-primary-text"
                />
              </If>
            </div>

            <div className="FailureReasonIcon__popover-date">
              {statusDate}
            </div>
          </PopoverHeader>

          <PopoverBody className="FailureReasonIcon__popover-body">
            <div>
              <span className="FailureReasonIcon__popover-primary-text">{I18n.t('COMMON.REASON')}: </span>
              {I18n.t(reason)}
            </div>

            <If condition={profileStatusComment}>
              <div>
                <span className="FailureReasonIcon__popover-primary-text">{I18n.t('COMMON.COMMENT')}: </span>
                {profileStatusComment}
              </div>
            </If>
          </PopoverBody>
        </Popover>
      </>
    );
  }
}

export default FailureReasonIcon;
