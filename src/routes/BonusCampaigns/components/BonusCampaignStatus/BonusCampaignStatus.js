import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import CopyToClipboard from '../../../../components/CopyToClipboard';
import PropTypes from '../../../../constants/propTypes';
import renderLabel from '../../../../utils/renderLabel';
import { shortify } from '../../../../utils/uuid';
import { statuses, statusesClassNames, statusesLabels } from '../../constants';
import './BonusCampaignStatus.scss';

class BonusCampaignStatus extends Component {
  static propTypes = {
    data: PropTypes.bonusCampaignEntity.isRequired,
    blockName: PropTypes.string,
  };
  static defaultProps = {
    blockName: 'bonus-campaign-status',
  };

  render() {
    const { data, blockName } = this.props;
    const className = statusesClassNames[data.state] || '';

    return (
      <div className={blockName}>
        <div className={classNames(`${blockName}__status`, className)}>
          {renderLabel(data.state, statusesLabels)}
        </div>
        {
          data.statusChangedDate &&
          <div className={`${blockName}__status-date`}>
            {I18n.t('BONUS_CAMPAIGN_STATUS.CHANGE_DATE', {
              date: moment.utc(data.statusChangedDate).format('DD.MM.YYYY HH:mm'),
            })}
          </div>
        }
        {
          data.state === statuses.PENDING &&
          <div className={`${blockName}__status-date`}>
            {I18n.t('BONUS_CAMPAIGN_STATUS.UNTIL_DATE', {
              date: moment.utc(data.startDate).format('DD.MM.YYYY HH:mm'),
            })}
          </div>
        }
        {
          data.authorUUID &&
          <div className={`${blockName}__status-author`}>
            {I18n.t('BONUS_CAMPAIGN_STATUS.AUTHOR')}
            <CopyToClipboard
              notify
              text={data.campaignUUID}
              notificationMessage={I18n.t('COMMON.NOTIFICATIONS.COPY_FULL_UUID.MESSAGE')}
            >
              <span>{shortify(data.authorUUID)}</span>
            </CopyToClipboard>
          </div>
        }
      </div>
    );
  }
}

export default BonusCampaignStatus;
