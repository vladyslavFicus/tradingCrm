import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Amount from '../../../../../../components/Amount';
import PropTypes from '../../../../../../constants/propTypes';
import { shortify } from '../../../../../../utils/uuid';
import Uuid from '../../../../../../components/Uuid';
import './Header.scss';

class Header extends Component {
  static propTypes = {
    data: PropTypes.shape({
      campaignName: PropTypes.bonusCampaignEntity.campaignName,
      authorUUID: PropTypes.bonusCampaignEntity.authorUUID,
      campaignUUID: PropTypes.bonusCampaignEntity.campaignUUID,
      creationDate: PropTypes.bonusCampaignEntity.creationDate,
      grantedSum: PropTypes.bonusCampaignEntity.grantedSum,
      grantedTotal: PropTypes.bonusCampaignEntity.grantedTotal,
      currency: PropTypes.bonusCampaignEntity.currency,
    }),
  };
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
          <div className="panel-heading-row_campaign-info">
            <div className="bonus__campaign__name">
              {campaignName}
            </div>
            <div className="bonus__campaign__uuid">
              <span className="short__uuid">
                <Uuid uuid={campaignUUID} uuidPrefix="CO" />
              </span>
            </div>
          </div>
        </div>

        <div className="row panel-body header-blocks header-blocks-5">
          <div className="header-block header-block_account">
          </div>
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.GRANTED')}
            </div>
            <div className="header-block-middle">
              <Amount amount={grantedSum} currency={currency} />
            </div>
            <div className="header-block-small">
              to {grantedTotal} Players
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.WAGERED')}
            </div>
            <div className="header-block-middle">
              empty
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CONVERTED')}
            </div>
            <div className="header-block-middle">
              empty
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CREATED')}
            </div>
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
