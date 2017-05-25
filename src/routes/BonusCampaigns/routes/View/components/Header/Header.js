import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from '../../../../../../components/Amount';
import { shortify } from '../../../../../../utils/uuid';
import './Header.scss';

class Header extends Component {
  render() {
    const {
      data: {
        campaignName,
        authorUUID,
        campaignUUID,
        creationDate,
        grantedSum,
        grantedTotal,
        currency,
      },
    } = this.props;
    return (
      <div>
        <div className="panel-heading-row">
          <div className="panel-heading-row_name-and-ids">
            <div className="player__account__name">
              {campaignName}
            </div>
            <div className="player__account__ids">
              <span className="short__uuid">{shortify(campaignUUID, 'CO')}</span>
            </div>
          </div>
        </div>

        <div className="row panel-body header-blocks header-blocks-5">
          <div className="header-block header-block_account">
            {/*<PlayerStatus
              status={profileStatus}
              reason={profileStatusReason}
              endDate={suspendEndDate}
              onChange={this.handleStatusChange}
              availableStatuses={availableStatuses}
            />*/}
          </div>
          <div className="header-block">
            <div className="header-block-title">Granted</div>
            <div className="header-block-middle">
              <Amount amount={grantedSum} currency={currency} />
            </div>
            <div className="header-block-small">
              to {grantedTotal} Players
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">Wagered</div>
            <div className="header-block-middle">
              empty
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">Converted</div>
            <div className="header-block-middle">
              empty
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">Created</div>
            <div className="header-block-middle">
              {moment(creationDate).fromNow()}
            </div>
            <div className="header-block-small">
              on {moment(creationDate).format('DD.MM.YYYY')}
            </div>
            {
              authorUUID &&
              <div className="header-block-small">
                by {shortify(authorUUID)}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
