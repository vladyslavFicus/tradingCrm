import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Button } from 'components';
import {
  DistributionRule,
  DistributionRule__SourceBrandConfig as DistributionRuleSourceBrandConfig,
  DistributionRule__TargetBrandConfig as DistributionRuleTargetBrandConfig,
} from '__generated__/types';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { Table, Column } from 'components/Table';
import useDistributionRulesGrid from 'routes/DistributionRules/hooks/useDistributionRulesGrid';
import { clientDistributionStatuses } from 'constants/clientsDistribution';
import { salesStatuses } from 'constants/salesStatuses';
import { ReactComponent as PlayIcon } from './img/play-icon.svg';
import { ReactComponent as PauseIcon } from './img/pause-icon.svg';
import { ReactComponent as TimeIcon } from './img/time-icon.svg';
import './DistributionRulesGrid.scss';

type BrandConfigs = Array<DistributionRuleSourceBrandConfig> | Array<DistributionRuleTargetBrandConfig>;

type Props = {
  content: Array<DistributionRule>,
  loading: boolean,
  last: boolean,
  onRefetch: () => void,
  onMore: () => void,
};

const DistributionRulesGrid = (props: Props) => {
  const { content, loading, last, onRefetch, onMore } = props;

  const {
    handleRowClick,
    handleStartMigrationClick,
  } = useDistributionRulesGrid();

  // ===== Renders ===== //
  const renderRule = ({ uuid, name, createdBy }: DistributionRule) => (
    <>
      <div
        className="DistributionRulesList__general DistributionRulesList__rule-name"
        onClick={() => handleRowClick(uuid)}
      >
        {name}
      </div>

      <If condition={!!uuid}>
        <div className="DistributionRulesList__additional">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>

      <If condition={!!createdBy}>
        <div className="DistributionRulesList__additional">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={createdBy || ''} uuidPrefix="OP" />
        </div>
      </If>
    </>
  );

  const renderOrder = ({ order }: DistributionRule) => (
    <Choose>
      <When condition={!!order}>
        <span className="DistributionRulesList__general">{order}</span>
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  );

  const renderStatus = ({ status, statusChangedAt, executionType }: DistributionRule) => (
    <>
      <div
        className={classNames(
          'DistributionRulesList__general',
          'DistributionRulesList__status',
          `DistributionRulesList__status--${status.toLowerCase()}`,
        )}
      >
        {I18n.t(clientDistributionStatuses[status])}
      </div>

      <If condition={!!statusChangedAt}>
        <div className="DistributionRulesList__additional">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedAt).local().format('DD.MM.YYYY HH:mm:ss') })}
        </div>
      </If>

      <If condition={!!executionType}>
        <div className="DistributionRulesList__additional">
          {I18n.t(`CLIENTS_DISTRIBUTION.EXECUTION_TYPE.${executionType}`)}
        </div>
      </If>
    </>
  );

  const renderBrands = (brands: BrandConfigs) => (
    <>
      {brands.map(({ brand, distributionUnit: { baseUnit, quantity } }) => (
        <div key={brand}>
          <div className="DistributionRulesList__general">{brand}</div>

          <div className="DistributionRulesList__additional">
            {`${quantity}${baseUnit === 'PERCENTAGE' ? '%' : ''} ${I18n.t('COMMON.CLIENTS')}`}
          </div>
        </div>
      ))}
    </>
  );

  const renderFromBrands = ({ sourceBrandConfigs }: DistributionRule) => {
    if (!sourceBrandConfigs) {
      return <span>&mdash;</span>;
    }

    return renderBrands(sourceBrandConfigs);
  };

  const renderToBrands = ({ targetBrandConfigs }: DistributionRule) => {
    if (!targetBrandConfigs) {
      return <span>&mdash;</span>;
    }

    return renderBrands(targetBrandConfigs);
  };

  const renderCountry = ({ sourceBrandConfigs }: DistributionRule) => {
    const countries = sourceBrandConfigs && sourceBrandConfigs[0]?.countries;

    if (!countries) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        {countries.slice(0, 3).map(country => (
          <CountryLabelWithFlag
            key={country}
            code={country}
            height="14"
          />
        ))}
        {countries.length > 3 && I18n.t('COMMON.AND_N_MORE', { value: countries.length - 3 })}
      </>
    );
  };

  const renderLanguages = ({ sourceBrandConfigs }: DistributionRule) => {
    const languages = sourceBrandConfigs && sourceBrandConfigs[0]?.languages;

    if (!languages) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        {languages.slice(0, 3).map(locale => (
          <div key={locale}>
            {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
          </div>
        ))}

        {languages.length > 3 && I18n.t('COMMON.AND_N_MORE', { value: languages.length - 3 })}
      </>
    );
  };

  const renderSalesStatus = ({ sourceBrandConfigs }: DistributionRule) => {
    const statuses = sourceBrandConfigs && sourceBrandConfigs[0]?.salesStatuses;

    if (!statuses) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        {statuses.slice(0, 3).map(status => (
          <div key={status} className="font-weight-600">
            {I18n.t(salesStatuses[status])}
          </div>
        ))}

        {statuses.length > 3 && I18n.t('COMMON.AND_N_MORE', { value: statuses.length - 3 })}
      </>
    );
  };

  const renderCreatedTime = ({ createdAt }: DistributionRule) => (
    <>
      <div className="DistributionRulesList__general">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>

      <div className="DistributionRulesList__additional">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </>
  );

  const renderTimeInStatus = ({ sourceBrandConfigs }: DistributionRule) => {
    const timeInCurrentStatusInHours = sourceBrandConfigs && sourceBrandConfigs[0]?.timeInCurrentStatusInHours;

    if (!timeInCurrentStatusInHours) {
      return <span>&mdash;</span>;
    }

    const { time, type } = timeInCurrentStatusInHours >= 24
      ? {
        time: Math.floor(timeInCurrentStatusInHours / 24),
        type: timeInCurrentStatusInHours / 24 > 1 ? 'DAYS' : 'DAY',
      }
      : {
        time: timeInCurrentStatusInHours,
        type: timeInCurrentStatusInHours > 1 ? 'HOURS' : 'HOUR',
      };

    return (
      <div className="DistributionRulesList__general">
        {`${time} ${I18n.t(`COMMON.${type}`)}`}
      </div>
    );
  };

  const renderLastTimeExecuted = ({ latestMigration }: DistributionRule) => {
    if (!latestMigration) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="DistributionRulesList__general">
          {moment.utc(latestMigration.startDate).local().format('DD.MM.YYYY')}
        </div>

        <div className="DistributionRulesList__additional">
          {moment.utc(latestMigration.startDate).local().format('HH:mm:ss')}
        </div>
      </>
    );
  };

  const renderActions = (rule: DistributionRule) => {
    const { sourceBrandConfigs, targetBrandConfigs, latestMigration, status, executionType } = rule;

    if (!sourceBrandConfigs || !targetBrandConfigs || status === 'INACTIVE') {
      return null;
    }

    return (
      <Button
        icon
        stopPropagation
        className="DistributionRulesList__action"
        data-testid="DistributionRulesList-actionButton"
        onClick={
          executionType === 'AUTO' || latestMigration?.status === 'IN_PROGRESS'
            ? () => {}
            : () => handleStartMigrationClick(rule, onRefetch)}
      >
        <Choose>
          <When condition={!!latestMigration && latestMigration.status === 'IN_PROGRESS'}>
            <PauseIcon />
          </When>

          <When condition={executionType === 'AUTO'}>
            <TimeIcon />
          </When>

          <Otherwise>
            <PlayIcon className="DistributionRulesList__actions-icon" />
          </Otherwise>
        </Choose>
      </Button>
    );
  };

  return (
    <div className="DistributionRulesGrid">
      <Table
        stickyFromTop={126}
        items={content}
        onMore={onMore}
        loading={loading}
        hasMore={!last}
      >
        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULE')}
          render={renderRule}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULER_ORDER')}
          render={renderOrder}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULE_STATUS')}
          render={renderStatus}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.SOURCE_BRAND')}
          render={renderFromBrands}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.TARGET_BRAND')}
          render={renderToBrands}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.COUNTRY')}
          render={renderCountry}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.LANGUAGES')}
          render={renderLanguages}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.SALES_STATUS')}
          render={renderSalesStatus}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.CREATED_TIME')}
          render={renderCreatedTime}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.TIME_IN_STATUS')}
          render={renderTimeInStatus}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.LAST_TIME_EXECUTED')}
          render={renderLastTimeExecuted}
        />

        <Column
          header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.ACTION')}
          render={renderActions}
        />
      </Table>
    </div>
  );
};

export default React.memo(DistributionRulesGrid);
