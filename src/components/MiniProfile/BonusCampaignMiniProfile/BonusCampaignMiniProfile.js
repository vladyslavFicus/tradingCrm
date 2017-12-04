import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from '../../../constants/propTypes';
import {
  statuses,
  statusesLabels,
  targetTypesLabels,
  campaignTypesLabels,
} from '../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../constants/form';
import Uuid from '../../Uuid';
import renderLabel from '../../../utils/renderLabel';
import Amount from '../../../components/Amount';
import './BonusCampaignMiniProfile.scss';

const BonusCampaignMiniProfile = (props) => {
  const {
    data: {
      authorUUID,
      campaignName,
      campaignRatio,
      uuid,
      creationDate,
      currency,
      endDate,
      campaignType,
      optIn,
      startDate,
      state,
      stateReason,
      statusChangedDate,
      targetType,
      statusChangedAuthorUUID,
      totalOptInPlayers,
      totalSelectedPlayers,
    },
  } = props;

  const status = state === statuses.FINISHED && stateReason === statuses.CANCELED
    ? statuses.CANCELED
    : state;

  return (
    <div className={classNames('mini-profile campaign-mini-profile', status.toLowerCase())}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">
          {renderLabel(status, statusesLabels)}
        </label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.CAMPAIGN')}</div>
        <div className="mini-profile-title font-weight-700">{campaignName}</div>
        <div className="mini-profile-ids font-weight-700">
          <Uuid uuid={uuid} uuidPrefix="CA" />
          {' - '}
          {optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}
        </div>
        <div className="mini-profile-ids">
          {
            status === statuses.CANCELED &&
            <div>
              {I18n.t('MINI_PROFILE.CANCELED')}
              {` ${I18n.t('COMMON.AUTHOR_BY')} `}
              <Uuid uuid={statusChangedAuthorUUID} uuidPrefix="OP" />
              {` ${I18n.t('COMMON.DATE_ON', {
                date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm'),
              })}`}
            </div>
          }
          {
            state === statuses.DRAFT &&
            <div>
              {I18n.t('MINI_PROFILE.CREATED')}
              {` ${I18n.t('COMMON.AUTHOR_BY')} `}
              <Uuid uuid={authorUUID} uuidPrefix="OP" />
              {` ${I18n.t('COMMON.DATE_ON',
                { date: moment.utc(creationDate).local().format('DD.MM.YYYY HH:mm') }
              )}`}
            </div>
          }
          {
            (status !== statuses.CANCELED && status !== statuses.DRAFT) &&
            <div>
              {I18n.t('MINI_PROFILE.LAUNCHED')}
              {` ${I18n.t('COMMON.AUTHOR_BY')} `}
              <Uuid uuid={statusChangedAuthorUUID} uuidPrefix="OP" />
              {` ${I18n.t('COMMON.DATE_ON', {
                date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm'),
              })}`}
            </div>
          }
        </div>
        <div className="mini-profile-ids">
          {`${I18n.t('MINI_PROFILE.DATE_RANGE')} `}
          {(startDate && endDate)
            ? `${moment.utc(startDate).local().format('DD.MM.YYYY')}
            -
            ${moment.utc(endDate).local().format('DD.MM.YYYY')}`
            : I18n.t('MINI_PROFILE.RANGE_NOT_SELECTED')
          }
        </div>
      </div>
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.TARGET')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {renderLabel(targetType, targetTypesLabels)}
            </div>
            <div className="info-block-description">
              {I18n.t('MINI_PROFILE.OPTED_IN', { value: totalOptInPlayers })}
            </div>
            <div className="info-block-description">
              {I18n.t('MINI_PROFILE.SELECTED', { value: totalSelectedPlayers })}
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.FULFILLMENT')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {renderLabel(campaignType, campaignTypesLabels)}
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.REWARD')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {I18n.t('MINI_PROFILE.BONUS')}
            </div>
            <div className="info-block-description">
              {
                campaignRatio.type === customValueFieldTypes.ABSOLUTE &&
                <Amount amount={campaignRatio.value} currency={currency} />
              }
              {
                campaignRatio.type === customValueFieldTypes.PERCENTAGE &&
                <span>
                  {`${campaignRatio.value} %`}
                </span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BonusCampaignMiniProfile.propTypes = {
  data: PropTypes.bonusCampaignEntity.isRequired,
};

export default BonusCampaignMiniProfile;
