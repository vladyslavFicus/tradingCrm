import React from 'react';
import './MiniProfile.scss';

const MiniProfile = () => (
  <div className="mini-profile mini-profile_inactive">
    <div className="mini-profile-header">
      <label className="mini-profile-label">inactive</label>
      <div className="mini-profile-type">Player</div>
      <div className="mini-profile-title">
        <b>Jimmy Black</b> (29)
        <i className="note-icon note-pinned-note" />
      </div>
      <div className="mini-profile-ids">
        <span>jimmyjimmy</span> - PL-9f2274d3
      </div>
      <div className="mini-profile-tags">
        <span className="mini-profile-tag mini-profile-tag_danger">
          Текст тега
        </span>
        <span className="mini-profile-tag mini-profile-tag_danger">
          One more bad tag
        </span>
        <span className="mini-profile-tag mini-profile-tag_success">
          Текст зеленого тега
        </span>
      </div>
    </div>
    <div className="mini-profile-status-reason">
      <div className="info-block">
        <div className="info-block_status-reason">status reason</div>
        <div className="info-block_status-reason_body">The reason that was selected on account status change</div>
      </div>
    </div>
    <div className="mini-profile-content">
      <div className="info-block">
        <div className="info-block-label">balance</div>
        <div className="info-block-content">€ 20 205,00</div>
      </div>
      <div className="info-block">
        <div className="info-block-label">last login</div>
        <div className="info-block-content">1 Month, 10 Days ago</div>
      </div>
      <div className="info-block">
        <div className="info-block-label">last login</div>
        <div className="info-block-content">1 Month, 10 Days ago</div>
      </div>
      <div className="info-block">
        <div className="info-block-label">last login</div>
        <div className="info-block-content">1 Month, 10 Days ago</div>
      </div>
    </div>
  </div>
);

export default MiniProfile;
