import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import moment from 'moment';
import renderLabel from 'utils/renderLabel';
import {
  clientDistributionStatuses,
  statusesLabels,
} from 'constants/clientsDistribution';
import './DistributionRuleInfo.scss';

class DistributionRuleInfo extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    statusChangedAt: PropTypes.string,
    latestMigration: PropTypes.shape({
      startDate: PropTypes.string,
    }),
  };

  static defaultProps = {
    status: '',
    createdAt: '',
    updatedAt: '',
    statusChangedAt: '',
    latestMigration: {},
  };

  render() {
    const {
      status,
      createdAt,
      updatedAt,
      statusChangedAt,
      latestMigration,
    } = this.props;

    const { startDate: latestMigrationDate } = latestMigration || {};

    return (
      <div className="DistributionRuleInfo">
        <If condition={status}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.STATUS')}
            </div>
            <div
              className={classNames(
                'DistributionRuleInfo__item-value',
                'text-uppercase',
                clientDistributionStatuses[status].color,
              )}
            >
              {renderLabel(status, statusesLabels)}
            </div>
            <If condition={statusChangedAt}>
              <div className="DistributionRuleInfo__item-small-text">
                {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.STATUS_SINCE')}&nbsp;
                {moment.utc(statusChangedAt).local().format('DD.MM.YYYY HH:mm')}
              </div>
            </If>
          </div>
        </If>
        <If condition={createdAt}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.CREATED')}
            </div>
            <div className="DistributionRuleInfo__item-value">
              {moment.utc(createdAt).local().format('DD.MM.YYYY')}
            </div>
            <div className="DistributionRuleInfo__item-small-text">
              {moment.utc(createdAt).local().format('HH:mm')}
            </div>
          </div>
        </If>
        <If condition={updatedAt}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.UPDATED')}
            </div>
            <div className="DistributionRuleInfo__item-value">
              {moment.utc(updatedAt).local().format('DD.MM.YYYY')}
            </div>
            <div className="DistributionRuleInfo__item-small-text">
              {moment.utc(updatedAt).local().format('HH:mm')}
            </div>
          </div>
        </If>
        <If condition={latestMigrationDate}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.LAST_EXECUTION')}
            </div>
            <div className="DistributionRuleInfo__item-value">
              {moment.utc(latestMigrationDate).local().format('DD.MM.YYYY')}
            </div>
            <div className="DistributionRuleInfo__item-small-text">
              {moment.utc(latestMigrationDate).local().format('HH:mm')}
            </div>
          </div>
        </If>
      </div>
    );
  }
}

export default DistributionRuleInfo;
