import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get, set, cloneDeep } from 'lodash';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { withApollo } from '@apollo/client/react/hoc';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { salesStatuses } from 'constants/salesStatuses';
import { clientDistributionStatuses } from 'constants/clientsDistribution';
import Uuid from 'components/Uuid';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import Placeholder from 'components/Placeholder';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { Table, Column } from 'components/Table';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import CreateRuleModal from '../../modals/CreateRuleModal';
import DistributionRulesFilters from '../DistributionRulesGridFilters';
import {
  DistributionRulesQuery,
  DistributionRuleMigrationMutation,
  DistributionRuleClientsAmountQuery,
} from '../graphql';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as PauseIcon } from './pause-icon.svg';
import { ReactComponent as TimeIcon } from './time-icon.svg';
import './DistributionRuleList.scss';

class DistributionRules extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    rules: PropTypes.query(PropTypes.arrayOf(PropTypes.ruleClientsDistributionType)).isRequired,
    migrateRules: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
      createRuleModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      rules: {
        data,
        variables: { args },
        fetchMore,
      },
    } = this.props;

    const page = get(data, 'distributionRules.number') || 0;

    fetchMore({
      variables: set({ args: { ...cloneDeep(args), page: page + 1 } }),
    });
  };

  handleStartMigration = async (uuid) => {
    const {
      migrateRules,
      rules: { refetch },
      modals: { confirmActionModal },
    } = this.props;

    try {
      await migrateRules({ variables: { uuid } });
      await refetch();

      confirmActionModal.hide();

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
  }

  handleCreateRule = () => {
    const {
      modals: { createRuleModal },
    } = this.props;

    createRuleModal.show();
  }

  handleStartMigrationClick = async ({ uuid, name, targetBrandConfigs, sourceBrandConfigs }) => {
    const targetBrandNames = targetBrandConfigs.map(({ brand }) => brand);
    const sourceBrandNames = sourceBrandConfigs.map(({ brand }) => brand);

    const {
      modals: { confirmActionModal },
      client,
    } = this.props;

    try {
      const {
        data: { distributionClientsAmount },
      } = await client.query({
        query: DistributionRuleClientsAmountQuery,
        variables: {
          uuid,
        },
        fetchPolicy: 'network-only',
      });

      confirmActionModal.show({
        onSubmit: () => this.handleStartMigration(uuid),
        modalTitle: I18n.t('CLIENTS_DISTRIBUTION.MIGRATION_MODAL.TITLE'),
        actionText: I18n.t('CLIENTS_DISTRIBUTION.MIGRATION_MODAL.TEXT', {
          name,
          targetBrandNames: targetBrandNames.toString(),
          sourceBrandNames: sourceBrandNames.toString(),
          clientsAmount: distributionClientsAmount,
        }),
        submitButtonLabel: I18n.t('CLIENTS_DISTRIBUTION.MIGRATION_MODAL.BUTTON_ACTION'),
      });
    } catch (e) {
      // Do nothing...
    }
  };

  renderRule = ({ uuid, name, createdBy }) => (
    <Fragment>
      <div
        className="DistributionRulesList__general DistributionRulesList__rule-name"
        onClick={() => this.handleRowClick(uuid)}
      >
        {name}
      </div>
      <If condition={uuid}>
        <div className="DistributionRulesList__additional">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>
      <If condition={createdBy}>
        <div className="DistributionRulesList__additional">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={createdBy} uuidPrefix="OP" />
        </div>
      </If>
    </Fragment>
  );

  renderActions = ({ latestMigration, status, executionType, ...rest }) => (
    <If condition={status !== 'INACTIVE'}>
      <Button
        icon
        stopPropagation
        className="DistributionRulesList__action"
        onClick={
          executionType === 'AUTO' || latestMigration?.status === 'IN_PROGRESS'
            ? () => {}
            : () => this.handleStartMigrationClick(rest)}
      >
        <Choose>
          <When condition={latestMigration && latestMigration.status === 'IN_PROGRESS'}>
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
    </If>
  );

  renderOrder = ({ order }) => (
    <Choose>
      <When condition={order}>
        <span className="DistributionRulesList__general">{order}</span>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderStatus = ({ status, statusChangedAt, executionType }) => (
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

      <If condition={statusChangedAt}>
        <div className="DistributionRulesList__additional">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedAt).local().format('DD.MM.YYYY HH:mm:ss') })}
        </div>
      </If>

      <If condition={executionType}>
        <div className="DistributionRulesList__additional">
          {I18n.t(`CLIENTS_DISTRIBUTION.EXECUTION_TYPE.${executionType}`)}
        </div>
      </If>
    </>
  );

  renderBrands = brands => (
    <Choose>
      <When condition={brands}>
        {brands.map(({ brand, distributionUnit: { baseUnit, quantity } }) => (
          <div key={brand}>
            <div className="DistributionRulesList__general">{brand}</div>
            <div className="DistributionRulesList__additional">
              {`${quantity}${baseUnit === 'PERCENTAGE' ? '%' : ''} ${I18n.t('COMMON.CLIENTS')}`}
            </div>
          </div>
        ))}
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderFromBrands = ({ sourceBrandConfigs }) => this.renderBrands(sourceBrandConfigs);

  renderToBrands = ({ targetBrandConfigs }) => this.renderBrands(targetBrandConfigs);

  renderCountry = ({ sourceBrandConfigs }) => {
    const countries = sourceBrandConfigs && sourceBrandConfigs[0]?.countries;

    return (
      <Choose>
        <When condition={countries}>
          {countries.slice(0, 3).map(country => (
            <CountryLabelWithFlag
              key={country}
              code={country}
              height="14"
            />
          ))}
          {countries.length > 3 && I18n.t('COMMON.AND_N_MORE', { value: countries.length - 3 })}
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  }

  renderLanguages = ({ sourceBrandConfigs }) => {
    const languages = sourceBrandConfigs && sourceBrandConfigs[0]?.languages;

    return (
      <Choose>
        <When condition={languages}>
          {languages.slice(0, 3).map(locale => (
            <div key={locale}>
              {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
            </div>
          ))}
          {languages.length > 3 && I18n.t('COMMON.AND_N_MORE', { value: languages.length - 3 })}
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  }

  renderSalesStatus = ({ sourceBrandConfigs }) => {
    const _statuses = sourceBrandConfigs && sourceBrandConfigs[0]?.salesStatuses;

    return (
      <Choose>
        <When condition={_statuses}>
          {_statuses.slice(0, 3).map(status => (
            <div
              key={status}
              className="font-weight-600"
            >
              {I18n.t(salesStatuses[status])}
            </div>
          ))}
          {_statuses.length > 3 && I18n.t('COMMON.AND_N_MORE', { value: _statuses.length - 3 })}
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  }

  renderCreatedTime = ({ createdAt }) => (
    <>
      <div className="DistributionRulesList__general">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="DistributionRulesList__additional">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </>
  );

  renderTimeInStatus = ({ sourceBrandConfigs }) => {
    const timeInCurrentStatusInHours = sourceBrandConfigs && sourceBrandConfigs[0]?.timeInCurrentStatusInHours;

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
      <Choose>
        <When condition={timeInCurrentStatusInHours}>
          <div className="DistributionRulesList__general">
            {`${time} ${I18n.t(`COMMON.${type}`)}`}
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  }

  renderLastTimeExecuted = ({ latestMigration }) => (
    <Choose>
      <When condition={latestMigration}>
        <div className="DistributionRulesList__general">
          {moment.utc(latestMigration.startDate).local().format('DD.MM.YYYY')}
        </div>
        <div className="DistributionRulesList__additional">
          {moment.utc(latestMigration.startDate).local().format('HH:mm:ss')}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  handleRowClick = (uuid) => {
    this.props.history.push(`/distribution/${uuid}/rule`);
  };

  render() {
    const {
      rules: {
        data,
        loading,
        refetch,
      },
    } = this.props;

    const {
      last = true,
      content = [],
      totalElements = 0,
    } = data?.distributionRules || {};

    return (
      <div className="DistributionRulesList">
        <div className="DistributionRulesList__header">
          <Placeholder
            ready={!loading}
            rows={[{ width: 220, height: 20 }]}
          >
            <span>
              <strong>{totalElements} </strong>
              {I18n.t('CLIENTS_DISTRIBUTION.TITLE')}
            </span>
          </Placeholder>
          <PermissionContent permissions={permissions.CLIENTS_DISTRIBUTION.CREATE_RULE}>
            <div className="ml-auto">
              <Button
                small
                tertiary
                onClick={this.handleCreateRule}
              >
                {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
              </Button>
            </div>
          </PermissionContent>
        </div>

        <DistributionRulesFilters handleRefetch={refetch} />

        <Table
          stickyFromTop={126}
          items={content}
          onMore={this.handlePageChanged}
          loading={loading}
          hasMore={!last}
        >
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULE')}
            render={this.renderRule}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULER_ORDER')}
            render={this.renderOrder}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULE_STATUS')}
            render={this.renderStatus}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.SOURCE_BRAND')}
            render={this.renderFromBrands}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.TARGET_BRAND')}
            render={this.renderToBrands}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.COUNTRY')}
            render={this.renderCountry}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.LANGUAGES')}
            render={this.renderLanguages}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.SALES_STATUS')}
            render={this.renderSalesStatus}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.CREATED_TIME')}
            render={this.renderCreatedTime}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.TIME_IN_STATUS')}
            render={this.renderTimeInStatus}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.LAST_TIME_EXECUTED')}
            render={this.renderLastTimeExecuted}
          />
          <Column
            header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.ACTION')}
            render={value => (
              <If condition={value.sourceBrandConfigs && value.targetBrandConfigs}>
                {this.renderActions(value)}
              </If>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  withModals({
    confirmActionModal: ConfirmActionModal,
    createRuleModal: CreateRuleModal,
  }),
  withRequests({
    rules: DistributionRulesQuery,
    migrateRules: DistributionRuleMigrationMutation,
  }),
)(DistributionRules);
