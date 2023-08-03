import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { Lead } from '__generated__/types';
import Uuid from 'components/Uuid';
import { statuses, leadStatuses } from 'routes/Leads/constants';
import './LeadAccountStatus.scss';

type Props = {
  lead: Lead,
};

const LeadAccountStatus = (props: Props) => {
  const { lead: { status, statusChangedDate, convertedToClientUuid, convertedByOperatorUuid } } = props;

  return (
    <div className="LeadAccountStatus">
      <div className="LeadAccountStatus__title">
        {I18n.t('COMMON.ACCOUNT_STATUS')}
      </div>

      <div className="LeadAccountStatus__label">
        <div
          className={classNames('LeadAccountStatus__status', {
            'LeadAccountStatus__status--new': status === 'NEW',
            'LeadAccountStatus__status--converted': status === 'CONVERTED',
          })}
        >
          {I18n.t(leadStatuses[status as statuses])}
        </div>

        <If condition={!!statusChangedDate}>
          <div className="LeadAccountStatus__additional">
            {I18n.t('COMMON.SINCE', {
              date: moment.utc(statusChangedDate || '').local().format('DD.MM.YYYY HH:mm:ss'),
            })}
          </div>
        </If>

        <If condition={!!convertedToClientUuid && !!convertedByOperatorUuid}>
          <div className="LeadAccountStatus__additional">
            {I18n.t('COMMON.BY')} <Uuid uuid={convertedByOperatorUuid || ''} />
          </div>
        </If>
      </div>
    </div>
  );
};

export default React.memo(LeadAccountStatus);
