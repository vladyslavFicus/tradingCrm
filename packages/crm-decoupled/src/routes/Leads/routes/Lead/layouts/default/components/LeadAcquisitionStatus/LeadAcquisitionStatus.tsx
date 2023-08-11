import React from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Constants } from '@crm/common';
import { Lead } from '__generated__/types';
import useLeadAcquisitionStatus from 'routes/Leads/routes/Lead/hooks/useLeadAcquisitionStatus';
import './LeadAcquisitionStatus.scss';

type Props = {
  lead: Lead,
  onRefetch: () => void,
};

const LeadAcquisitionStatus = (_props: Props) => {
  const {
    salesStatus,
    color,
    salesOperatorName,
    teamName,
    deskName,
    handleChangeAsquisitionStatus,
  } = useLeadAcquisitionStatus(_props);

  return (
    <div className="LeadAcquisitionStatus">
      <div className="LeadAcquisitionStatus__title">
        {I18n.t('LEAD_PROFILE.ASQUISITION_STATUS.TITLE')}
      </div>

      <div className="LeadAcquisitionStatus__content">
        <div
          className={classNames('LeadAcquisitionStatus__item', `LeadAcquisitionStatus__item--${color}`)}
          onClick={handleChangeAsquisitionStatus}
        >
          <div className="LeadAcquisitionStatus__left">
            <div className="LeadAcquisitionStatus__representative">
              {I18n.t('LEAD_PROFILE.ASQUISITION_STATUS.SALES')}
            </div>

            <Choose>
              <When condition={!!salesStatus}>
                <div className={classNames(
                  'LeadAcquisitionStatus__status',
                  `LeadAcquisitionStatus__status--${color}`,
                )}
                >
                  {I18n.t(Constants.salesStatuses[salesStatus as string])}
                </div>
              </When>

              <Otherwise>
                &mdash;
              </Otherwise>
            </Choose>
          </div>

          <div className="LeadAcquisitionStatus__right">
            <Choose>
              <When condition={!!salesOperatorName}>
                <div className="LeadAcquisitionStatus__operator">{salesOperatorName}</div>
              </When>

              <Otherwise>
                &mdash;
              </Otherwise>
            </Choose>

            <If condition={!!deskName}>
              <div>
                <b>{I18n.t('COMMON.DESK')}:</b> {deskName}
              </div>
            </If>

            <If condition={!!teamName}>
              <div>
                <b>{I18n.t('COMMON.TEAM')}:</b> {teamName}
              </div>
            </If>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeadAcquisitionStatus);
