import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { Constants } from '@crm/common';
import { Button } from 'components';
import { DistributionRule__Statuses__Enum as DistributionRuleStatusesEnum } from '__generated__/types';
import useDistributionRuleInfo from 'routes/DistributionRules/hooks/useDistributionRuleInfo';
import { DistributionRuleType } from 'routes/DistributionRules/hooks/useDistributionRule';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import './DistributionRuleInfo.scss';

type Props = {
  distributionRule: DistributionRuleType,
};

const DistributionRuleInfo = (props: Props) => {
  const {
    distributionRule: {
      uuid,
      status,
      statusChangedAt,
      createdAt,
      updatedAt,
      latestMigration,
      executionType,
      totalMigratedClients,
    },
  } = props;

  const {
    handleUpdateRuleStatus,
    handleStartMigration,
  } = useDistributionRuleInfo(uuid);

  // ===== Renders ===== //
  const renderDateColumn = (label: string, date: string) => (
    <div className="DistributionRuleInfo__item">
      <div className="DistributionRuleInfo__item-label">
        {label}
      </div>

      <div className="DistributionRuleInfo__item-value">
        {moment.utc(date).local().format('DD.MM.YYYY')}
      </div>

      <div className="DistributionRuleInfo__item-small-text">
        {moment.utc(date).local().format('HH:mm')}
      </div>
    </div>
  );

  const renderValueColumn = (label: string, value: number) => (
    <div className="DistributionRuleInfo__item">
      <div className="DistributionRuleInfo__item-label">
        {label}
      </div>

      <div className="DistributionRuleInfo__item-value">
        {value}
      </div>
    </div>
  );

  return (
    <div className="DistributionRuleInfo">
      <If condition={!!status}>
        <UncontrolledDropdown className="DistributionRuleInfo__status">
          <DropdownToggle className="DistributionRuleInfo__item" tag="div">
            <div className="DistributionRuleInfo__item-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.STATUS')}
            </div>

            <div
              className={classNames(
                'DistributionRuleInfo__status__toggle-item',
                'DistributionRuleInfo__item-value',
                'DistributionRuleInfo__status-item',
                `DistributionRuleInfo__status-item--${status.toLowerCase()}`,
              )}
            >
              {I18n.t(Constants.clientDistributionStatuses[status])}
              <i className="DistributionRuleInfo__status__arrow fa fa-angle-down" />
            </div>

            <If condition={!!statusChangedAt}>
              <div className="DistributionRuleInfo__item-small-text">
                {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.STATUS_SINCE')}&nbsp;
                {moment.utc(statusChangedAt).local().format('DD.MM.YYYY HH:mm')}
              </div>
            </If>
          </DropdownToggle>

          <DropdownMenu className="DistributionRuleInfo__status__dropdown-menu">
            {(Object.keys(Constants.clientDistributionStatuses) as [DistributionRuleStatusesEnum])
              .filter(key => key !== status)
              .map(key => (
                <DropdownItem
                  key={key}
                  className={classNames(
                    'DistributionRuleInfo__status__dropdown-item',
                    'DistributionRuleInfo__item-value',
                  )}
                  onClick={() => handleUpdateRuleStatus(key)}
                >
                  {I18n.t(Constants.clientDistributionStatuses[key])}
                </DropdownItem>
              ))
            }
          </DropdownMenu>
        </UncontrolledDropdown>
      </If>

      <If condition={!!createdAt}>
        {renderDateColumn(I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.CREATED'), createdAt)}
      </If>

      <If condition={!!updatedAt}>
        {renderDateColumn(I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.UPDATED'), updatedAt)}
      </If>

      <If condition={!!latestMigration?.startDate}>
        {renderDateColumn(I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.LAST_EXECUTION'), latestMigration?.startDate || '')}
      </If>

      {renderValueColumn(I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.TOTAL_MIGRATED_CLIENTS'), totalMigratedClients || 0)}

      <If condition={status === DistributionRuleStatusesEnum.ACTIVE && executionType === 'MANUAL'}>
        <Button
          className="DistributionRuleInfo__action"
          data-testid="DistributionRuleInfo-actionButton"
          onClick={handleStartMigration}
        >
          <div className="DistributionRuleInfo__item-label">
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.ACTION')}
          </div>

          <PlayIcon className="DistributionRulesList__actions-icon" />
        </Button>
      </If>
    </div>
  );
};

export default React.memo(DistributionRuleInfo);
