import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import compose from 'compose-function';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { LevelType, Notify } from 'types';
import { withNotifications } from 'hoc';
import { parseErrors } from 'apollo';
import { Button } from 'components/UI';
import { DistributionRule__Statuses__Enum as DistributionRuleStatuses } from '__generated__/types';
import { clientDistributionStatuses } from 'constants/clientsDistribution';
import { DistributionRuleType } from '../../DistributionRule';
import { useDistributionRuleUpdateStatus } from './graphql/__generated__/DistributionRuleUpdateStatusMutation';
import { useDistributionRuleMigrationMutation } from './graphql/__generated__/DistributionRuleMigrationMutation';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import './DistributionRuleInfo.scss';


type Props = {
  notify: Notify,
  distributionRule: DistributionRuleType,
}

const DistributionRuleInfo = (props: Props) => {
  const {
    notify,
    distributionRule: {
      uuid,
      status,
      statusChangedAt,
      createdAt,
      updatedAt,
      latestMigration,
      executionType,
    },
  } = props;

  const [updateRuleStatus] = useDistributionRuleUpdateStatus();
  const [startMigrationRule] = useDistributionRuleMigrationMutation();

  // ===== Handlers ===== //
  const handleUpdateRuleStatus = async (ruleStatus: DistributionRuleStatuses) => {
    try {
      await updateRuleStatus({
        variables: {
          uuid,
          ruleStatus,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_TITLE'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_MESSAGE'),
      });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message: error === 'error.entity.not.complete'
          ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.INCOMPLETE_STATUS', { name: ruleStatus })
          : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
    }
  };

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

  const handleStartMigration = async () => {
    try {
      await startMigrationRule({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_SUCCESSFUL'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_ERROR'),
      });
    }
  };


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
                clientDistributionStatuses[status].color,
              )}
            >
              {I18n.t(clientDistributionStatuses[status].label)}
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
            {(Object.keys(clientDistributionStatuses) as [DistributionRuleStatuses])
              .filter(key => key !== status)
              .map(key => (
                <DropdownItem
                  key={key}
                  className={classNames(
                    'DistributionRuleInfo__status__dropdown-item',
                    'DistributionRuleInfo__item-value',
                    clientDistributionStatuses[key].color,
                  )}
                  onClick={() => handleUpdateRuleStatus(key)}
                >
                  {I18n.t(clientDistributionStatuses[key].label)}
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
      <If condition={status === DistributionRuleStatuses.ACTIVE && executionType === 'MANUAL'}>
        <Button
          transparent
          className="DistributionRuleInfo__action"
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

export default compose(
  React.memo,
  withNotifications,
)(DistributionRuleInfo);
