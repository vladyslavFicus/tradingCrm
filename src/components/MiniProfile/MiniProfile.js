import React, { Component } from 'react';
import { Popover, PopoverContent } from 'reactstrap';
//import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
// import { entitiesPrefixes } from '../../constants/uuid';
import './MiniProfile.scss';

class MiniProfile extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    placement: PropTypes.string,
    labelStatus: PropTypes.string,
    target: PropTypes.string.isRequired,
    profileType: PropTypes.string.isRequired,
  };
  static defaultProps = {
    isOpen: false,
    placement: 'right',
    labelStatus: 'inactive',
    profileType: 'Player', /* delete */
  };

  renderHeader = (profileType, labelStatus) => {
    return (
      <div className="mini-profile_header">
        <label className={`mini-profile-label label-${labelStatus}`}>inactive</label>
        <div className="mini-profile-type">{profileType}</div>
        <div className="mini-profile-title">
          <b>Jimmy Black</b> (29)
          <img src="assets/img/kyc-check-icon.svg" alt="check" />
          <img src="assets/img/pinned-note-icon.png" alt="note" />
        </div>
        <div className="mini-profile-subtitle">
          <span>jimmyjimmy</span> - PL-9f2274d3
        </div>
        <div className="mini-profile_tags" />
      </div>
    );
  };

  renderBody = () => {
    return (
      <div className="mini-profile_body">
        <div className="info-block">
          <div className="info-block_left">balance</div>
          <div className="info-block_right">€ 20 205,00</div>
        </div>
        <div className="info-block">
          <div className="info-block_left">last login</div>
          <div className="info-block_right">1 Month, 10 Days ago</div>
        </div>
        <div className="info-block">
          <div className="info-block_left">last login</div>
          <div className="info-block_right">1 Month, 10 Days ago</div>
        </div>
        <div className="info-block">
          <div className="info-block_left">last login</div>
          <div className="info-block_right">1 Month, 10 Days ago</div>
        </div>
      </div>
    );
  };

  renderStatusReasonBody = () => {
    return (
      <div className="mini-profile_body">
        <div className="info-block">
          <div className="info-block_status-reason">status reason</div>
          <div className="info-block_status-reason_body">The reason that was selected on account status change</div>
        </div>
      </div>
    );
  };

  render() {
    const { isOpen, placement, target } = this.props;

    return (
      <Popover isOpen={isOpen} placement={placement} target={target} className="mini-profile">
        <PopoverContent>
          {this.renderHeader()}
          {this.renderStatusReasonBody()}
          {this.renderBody()}
        </PopoverContent>
      </Popover>
    );
  }
}
export default MiniProfile;
