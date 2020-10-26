import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get, set, cloneDeep } from 'lodash';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { compose, withApollo } from 'react-apollo';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import { salesStatuses } from 'constants/salesStatuses';
import { clientDistributionStatuses } from 'constants/clientsDistribution';
import Uuid from 'components/Uuid';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Grid, { GridColumn } from 'components/Grid';
import Placeholder from 'components/Placeholder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import ClientsDistributionModal from 'modals/ClientsDistributionModal';
import DistributionRulesFilters from '../DistributionRulesGridFilters';
import {
  DistributionRulesQuery,
  DistributionRuleMigrationMutation,
  DistributionRuleClientsAmountQuery,
} from '../graphql';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as TimeIcon } from './time-icon.svg';
import './DistributionRuleList.scss';

class DistributionRules extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    rules: PropTypes.query(PropTypes.arrayOf(PropTypes.ruleClientsDistributionType)).isRequired,
    migrateRules: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
      clientsDistributionModal: PropTypes.modalType,
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
        loadMore,
      },
    } = this.props;

    const page = get(data, 'distributionRules.number') || 0;

    loadMore(set({ args: { ...cloneDeep(args), page: page + 1 } }));
  };

  handleStartMigration = async (uuid) => {
    const {
      migrateRules,
      notify,
      rules: { refetch },
      modals: { confirmActionModal },
    } = this.props;

    try {
      await migrateRules({ variables: { uuid } });
      await refetch();

      confirmActionModal.hide();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_SUCCESSFUL'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_ERROR'),
      });
    }
  }

  handleCreateRule = () => {
    const {
      modals: { clientsDistributionModal },
    } = this.props;

    clientsDistributionModal.show({
      action: 'CREATE',
      onSuccess: (uuid) => {
        clientsDistributionModal.hide();

        this.props.history.push(`/distribution/${uuid}/rule`);
      },
    });
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
      <div className="font-weight-700">
        {name}
      </div>
      <If condition={uuid}>
        <div className="font-size-11">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>
      <If condition={createdBy}>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={createdBy} uuidPrefix="OP" />
        </div>
      </If>
    </Fragment>
  );

  renderActions = ({ latestMigration, status, executionType, ...rest }) => (
    <If condition={status !== 'INACTIVE'}>
      <Button
        transparent
        stopPropagation
        className="DistributionRulesList__action"
        onClick={executionType === 'AUTO' ? () => {} : () => this.handleStartMigrationClick(rest)}
      >
        <Choose>
          <When condition={latestMigration && latestMigration.status === 'IN_PROGRESS'}>
            <i className="DistributionRulesList__actions-icon icon-pause" />
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
        <span className="font-weight-700">{order}</span>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderStatus = ({ status, statusChangedAt }) => (
    <>
      <div className={classNames('text-uppercase font-weight-700', clientDistributionStatuses[status].color)}>
        {I18n.t(clientDistributionStatuses[status].label)}
      </div>

      <If condition={statusChangedAt}>
        <div className="font-size-11">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedAt).local().format('DD.MM.YYYY HH:mm:ss') })}
        </div>
      </If>
    </>
  );

  renderBrands = brands => (
    <Choose>
      <When condition={brands}>
        {brands.map(({ brand, distributionUnit: { baseUnit, quantity } }) => (
          <div key={brand}>
            <div className="font-weight-700">{brand}</div>
            <div className="font-size-11">
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

  renderCountry = ({ countries }) => (
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

  renderSalesStatus = ({ salesStatuses: statuses }) => (
    <Choose>
      <When condition={statuses}>
        {statuses.slice(0, 3).map(status => (
          <div
            key={status}
            className="font-weight-600"
          >
            {I18n.t(salesStatuses[status])}
          </div>
        ))}
        {statuses.length > 3 && I18n.t('COMMON.AND_N_MORE', { value: statuses.length - 3 })}
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderCreatedTime = ({ createdAt }) => (
    <>
      <div className="font-weight-700">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </>
  );

  renderExecutionTime = ({ executionType, executionPeriodInHours }) => {
    const { time, type } = executionPeriodInHours >= 24
      ? {
        time: Math.floor(executionPeriodInHours / 24),
        type: executionPeriodInHours / 24 > 1 ? 'DAYS' : 'DAY',
      }
      : {
        time: executionPeriodInHours,
        type: executionPeriodInHours > 1 ? 'HOURS' : 'HOUR',
      };

    return (
      <Choose>
        <When condition={executionPeriodInHours}>
          <div className="font-weight-700">
            {`${time} ${I18n.t(`COMMON.${type}`)}`}
          </div>
          <div className="font-size-11">
            {I18n.t(`CLIENTS_DISTRIBUTION.EXECUTION_TYPE.${executionType}`)}
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
        <div className="font-weight-700">
          {moment.utc(latestMigration.startDate).local().format('DD.MM.YYYY')}
        </div>
        <div className="font-size-11">
          {moment.utc(latestMigration.startDate).local().format('HH:mm:ss')}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  handleRowClick = ({ uuid }) => {
    this.props.history.push(`/distribution/${uuid}/rule`);
  };

  render() {
    const {
      rules: {
        data,
        loading,
      },
    } = this.props;

    const { last, totalElements, content } = data?.distributionRules || { content: [] };

    return (
      <div className="DistributionRulesList card">
        <div className="card-heading card-heading--is-sticky">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
            )}
          >
            <span className="font-size-20">
              {totalElements} {I18n.t('CLIENTS_DISTRIBUTION.TITLE')}
            </span>
          </Placeholder>
          <PermissionContent permissions={permissions.CLIENTS_DISTRIBUTION.CREATE_RULE}>
            <div className="ml-auto">
              <Button
                small
                commonOutline
                onClick={this.handleCreateRule}
              >
                {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
              </Button>
            </div>
          </PermissionContent>
        </div>
        <DistributionRulesFilters />

        <div className="card-body--table">
          <Grid
            data={content}
            isLoading={loading}
            isLastPage={last}
            withLazyLoad
            withRowsHover
            headerStickyFromTop={127}
            handleRowClick={this.handleRowClick}
            handlePageChanged={this.handlePageChanged}
            withNoResults={!loading && content.length === 0}
          >
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULE')}
              render={this.renderRule}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULER_ORDER')}
              render={this.renderOrder}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.RULE_STATUS')}
              render={this.renderStatus}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.FROM_BRAND')}
              render={this.renderFromBrands}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.TO_BRAND')}
              render={this.renderToBrands}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.COUNTRY')}
              render={this.renderCountry}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.SALES_STATUS')}
              render={this.renderSalesStatus}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.CREATED_TIME')}
              render={this.renderCreatedTime}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.EXECUTION_TIME')}
              render={this.renderExecutionTime}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.LAST_TIME_EXECUTED')}
              render={this.renderLastTimeExecuted}
            />
            <GridColumn
              header={I18n.t('CLIENTS_DISTRIBUTION.GRID_HEADER.ACTION')}
              render={value => (
                <If condition={value.sourceBrandConfigs && value.targetBrandConfigs}>
                  {this.renderActions(value)}
                </If>
              )}
            />
          </Grid>
        </div>
      </div>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  withModals({
    confirmActionModal: ConfirmActionModal,
    clientsDistributionModal: ClientsDistributionModal,
  }),
  withNotifications,
  withRequests({
    rules: DistributionRulesQuery,
    migrateRules: DistributionRuleMigrationMutation,
  }),
)(DistributionRules);
