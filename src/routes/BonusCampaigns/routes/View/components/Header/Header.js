import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Amount from '../../../../../../components/Amount';
import PropTypes from '../../../../../../constants/propTypes';
import Uuid from '../../../../../../components/Uuid';
import './Header.scss';

class Header extends Component {
  static propTypes = {
    data: PropTypes.bonusCampaignEntity.isRequired,
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
          <div className="header-block header-block_account" />
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.GRANTED')}
            </div>
            <div className="header-block-middle">
              <Amount amount={grantedSum} currency={currency} />
            </div>
            <div className="header-block-small">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.GRANTED_TO', { count: grantedTotal })}
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.WAGERED')}
            </div>
            <div className="header-block-middle">
              {I18n.t('COMMON.EMPTY')}
            </div>
          </div>
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CONVERTED')}
            </div>
            <div className="header-block-middle">
              {I18n.t('COMMON.EMPTY')}
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
              {I18n.t('COMMON.DATE_ON', {
                date: moment.utc(creationDate).format('DD.MM.YYYY'),
              })}
            </div>
            {
              authorUUID &&
              <div className="header-block-small">
                {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={authorUUID} />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
