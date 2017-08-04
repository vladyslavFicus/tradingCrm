import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import FileUpload from '../../../../../../components/FileUpload';
import Amount from '../../../../../../components/Amount';
import PropTypes from '../../../../../../constants/propTypes';
import Uuid from '../../../../../../components/Uuid';
import StatusDropDown from '../../../../components/StatusDropDown';
import { statuses, targetTypes, moneyTypeUsageLabels } from '../../../../../../constants/bonus-campaigns';
import renderLabel from '../../../../../../utils/renderLabel';
import './Header.scss';

class Header extends Component {
  static propTypes = {
    data: PropTypes.bonusCampaignEntity.isRequired,
    availableStatusActions: PropTypes.arrayOf(PropTypes.object),
    onChangeCampaignState: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
  };
  static defaultProps = {
    availableStatusActions: [],
  };

  render() {
    const {
      data: {
        name,
        moneyTypePriority,
        authorUUID,
        uuid,
        creationDate,
        grantedSum,
        grantedTotal,
        currency,
        state,
        targetType,
      },
      data,
      availableStatusActions,
      onChangeCampaignState,
    } = this.props;

    return (
      <div>
        <div className="panel-heading-row">
          <div className="panel-heading-row_campaign-info">
            <div className="bonus__campaign__name">
              {name}
            </div>
            <div className="bonus__campaign__uuid">
              <span className="short__uuid">
                <Uuid uuid={uuid} uuidPrefix="CA" />
                {' - '}
                {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.MONEY_TYPE_PRIORITY', {
                  priority: renderLabel(moneyTypePriority, moneyTypeUsageLabels),
                })}
              </span>
            </div>
          </div>
          {
            state === statuses.DRAFT && targetType === targetTypes.TARGET_LIST &&
            <div className="panel-heading-row_actions">
              <FileUpload
                label={I18n.t('BONUS_CAMPAIGNS.VIEW.BUTTON.ADD_PLAYERS')}
                allowedTypes={['text/csv', 'application/vnd.ms-excel']}
                onChosen={this.props.onUpload}
                className="btn btn-info-outline"
              />
            </div>
          }
        </div>

        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <StatusDropDown
              onChange={onChangeCampaignState}
              campaign={data}
              availableStatusActions={availableStatusActions}
            />
          </div>
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
              {moment.utc(creationDate).fromNow()}
            </div>
            <div className="header-block-small">
              {I18n.t('COMMON.DATE_ON', {
                date: moment.utc(creationDate).local().format('DD.MM.YYYY'),
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
