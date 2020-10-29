import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import { leadStatuses } from '../../../../constants';
import './LeadAccountStatus.scss';

class LeadAccountStatus extends PureComponent {
  static propTypes = {
    lead: PropTypes.lead.isRequired,
  };

  render() {
    const { lead } = this.props;

    const {
      status,
      statusChangedDate,
      convertedToClientUuid,
      convertedByOperatorUuid,
    } = lead || {};

    return (
      <div className="LeadAccountStatus">
        <div className="LeadAccountStatus__title">
          {I18n.t('COMMON.ACCOUNT_STATUS')}
        </div>

        <div className="LeadAccountStatus__label">
          <div className={classNames('LeadAccountStatus__status', leadStatuses[status].color)}>
            {I18n.t(leadStatuses[status].label)}
          </div>

          <If condition={statusChangedDate}>
            <div className="LeadAccountStatus__secondary">
              {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm:ss') })}
            </div>
          </If>

          <If condition={convertedToClientUuid}>
            <Choose>
              <When condition={convertedByOperatorUuid}>
                <div className="LeadAccountStatus__secondary">
                  {I18n.t('COMMON.BY')} <Uuid uuid={convertedByOperatorUuid} />
                </div>
              </When>
              <Otherwise>
                <div className="LeadAccountStatus__secondary">
                  {I18n.t('LEADS.STATUSES.SELF_CONVETED')}
                </div>
              </Otherwise>
            </Choose>
          </If>
        </div>
      </div>
    );
  }
}

export default LeadAccountStatus;
