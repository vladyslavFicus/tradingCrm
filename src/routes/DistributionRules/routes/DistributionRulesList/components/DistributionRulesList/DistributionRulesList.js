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
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Grid, { GridColumn } from 'components/Grid';
import Placeholder from 'components/Placeholder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import DistributionRulesFilters from '../DistributionRulesGridFilters';
import { clientDistributionStatuses } from '../constants';
import {
  DistributionRulesQuery,
  DistributionRuleMigrationMutation,
  DistributionRuleClientsAmountQuery,
} from '../graphql';

class DistributionRules extends PureComponent {
  static propTypes = {
    rules: PropTypes.query(PropTypes.arrayOf(PropTypes.ruleClientsDistributionType)).isRequired,
    migration: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
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
      migration,
      notify,
      rules: { refetch },
      modals: { confirmActionModal },
    } = this.props;

    try {
      await migration({ variables: { uuid } });
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

  handleStartMigrationClick = async ({ uuid, name, targetBrandConfigs, sourceBrandConfigs }) => {
    const targetBrandNames = targetBrandConfigs.map(({ brand }) => brand);
    const sourceBrandNames = sourceBrandConfigs.map(({ brand }) => brand);

    const {
      modals: { confirmActionModal },
      client,
    } = this.props;

    try {
      const {
        data: {
          clientsAmount: {
            clientsAmount,
          },
        },
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
          clientsAmount,
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
          <Uuid uuid={createdBy} uuidPrefix="OP" />
        </div>
      </If>
    </Fragment>
  );

  renderActions = ({ latestMigration, ...rest }) => (
    <Button
      transparent
      onClick={() => this.handleStartMigrationClick(rest)}
    >
      <Choose>
        <When condition={latestMigration && latestMigration.status === 'IN_PROGRESS'}>
          <i className="icon-pause btn-transparent" />
        </When>
        <Otherwise>
          <i className="icon-play btn-transparent" />
        </Otherwise>
      </Choose>
    </Button>
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

  renderFromBrands = ({ sourceBrandConfigs }) => (
    <Choose>
      <When condition={sourceBrandConfigs}>
        {sourceBrandConfigs.map(({ brand, distributionUnit }) => (
          <>
            <div className="font-weight-700">{brand}</div>
            <div className="font-size-11">{`${distributionUnit.quantity} ${I18n.t('COMMON.CLIENTS')}`}</div>
          </>
        ))}
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderToBrands = ({ targetBrandConfigs }) => (
    <Choose>
      <When condition={targetBrandConfigs}>
        {targetBrandConfigs.map(({ brand, distributionUnit }) => (
          <>
            <div className="font-weight-700">{brand}</div>
            <div className="font-size-11">{`${distributionUnit.quantity} ${I18n.t('COMMON.CLIENTS')}`}</div>
          </>
        ))}
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderCountry = ({ countries }) => (
    <Choose>
      <When condition={countries}>
        {countries.map(country => (
          <CountryLabelWithFlag
            code={country}
            height="14"
          />
        ))}
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderSalesStatus = ({ salesStatuses: statuses }) => (
    <Choose>
      <When condition={statuses}>
        {statuses.map(status => (
          <div className="font-weight-600">{I18n.t(salesStatuses[status])}</div>
        ))}
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
    const day = Math.floor(executionPeriodInHours / 24);

    return (
      <Choose>
        <When condition={executionPeriodInHours}>
          <div className="font-weight-700">
            {`${day} ${I18n.t(`COMMON.${day > 1 ? 'DAYS' : 'DAY'}`)}`}
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

  renderLastTimeExecuted = ({ statusChangedAt }) => (
    <>
      <div className="font-weight-700">
        {moment.utc(statusChangedAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(statusChangedAt).local().format('HH:mm:ss')}
      </div>
    </>
  );

  render() {
    const {
      rules: {
        data,
        loading,
      },
    } = this.props;

    const entities = get(data, 'distributionRules') || { content: [] };

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
              </div>
            )}
          >
            <span className="font-size-20">
              {entities.totalElements} {I18n.t('CLIENTS_DISTRIBUTION.TITLE')}
            </span>
          </Placeholder>
          <div className="ml-auto">
            <Button
              type="submit"
              small
              commonOutline
              onClick={() => console.log('--Handle add rule--')}
            >
              {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
            </Button>
          </div>
        </div>
        <DistributionRulesFilters />

        <div className="card-body">
          <Grid
            data={entities.content}
            isLoading={loading}
            isLastPage={entities.last}
            withLazyLoad
            handlePageChanged={this.handlePageChanged}
            withNoResults={!loading && entities.content.length === 0}
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
  }),
  withNotifications,
  withRequests({
    rules: DistributionRulesQuery,
    migration: DistributionRuleMigrationMutation,
  }),
)(DistributionRules);
