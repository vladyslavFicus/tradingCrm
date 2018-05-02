import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Uuid from '../Uuid';
import PropTypes from '../../constants/propTypes';
import renderLabel from '../../utils/renderLabel';
import { statuses, statusesClassNames, statusesLabels, statusesReasons } from '../../constants/bonus-campaigns';
import './BonusCampaignStatus.scss';

class BonusCampaignStatus extends Component {
  static propTypes = {
    campaign: PropTypes.shape({
      state: PropTypes.string.isRequired,
      stateReason: PropTypes.string,
      statusChangedDate: PropTypes.string,
      startDate: PropTypes.string,
      statusChangedAuthorUUID: PropTypes.string,
    }).isRequired,
    blockName: PropTypes.string,
    showAdditionalInfo: PropTypes.bool,
  };
  static defaultProps = {
    blockName: 'bonus-campaign-status',
    showAdditionalInfo: true,
  };

  render() {
    const { campaign, blockName, showAdditionalInfo } = this.props;
    const status = campaign.state === statuses.FINISHED && campaign.stateReason === statusesReasons.CANCELED
      ? statuses.CANCELED
      : campaign.state;
    const className = statusesClassNames[status] || '';

    return (
      <div className={blockName}>
        <div className={classNames(`${blockName}__status`, className)}>
          {renderLabel(status, statusesLabels)}
        </div>
        {
          showAdditionalInfo &&
          <div>
            {
              campaign.statusChangedDate &&
              <div className={`${blockName}__status-date`}>
                {I18n.t('COMMON.DATE_ON', {
                  date: moment.utc(campaign.statusChangedDate).local().format('DD.MM.YYYY HH:mm'),
                })}
              </div>
            }
            {
              status === statuses.PENDING &&
              <div className={`${blockName}__status-date`}>
                {I18n.t('COMMON.DATE_UNTIL', {
                  date: moment.utc(campaign.startDate).local().format('DD.MM.YYYY HH:mm'),
                })}
              </div>
            }
            {
              campaign.statusChangedAuthorUUID &&
              <div className={`${blockName}__status-author`}>
                {I18n.t('COMMON.AUTHOR_BY')}
                <Uuid uuid={campaign.statusChangedAuthorUUID} />
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default BonusCampaignStatus;
