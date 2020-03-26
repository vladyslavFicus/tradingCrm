import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import countries from 'utils/countryList';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import Uuid from 'components/Uuid';
import RulesFilters from 'components/HierarchyProfileRules/components/RulesGridFilters';
import Grid, { GridColumn } from 'components/Grid';
import Placeholder from 'components/Placeholder';
import Permissions from 'utils/permissions';
import infoConfig from './constants';

class SalesRules extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    rules: PropTypes.shape({
      rules: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.ruleType),
        error: PropTypes.object,
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    deleteRule: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      deleteModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  };

  handleFiltersChanged = (filters = {}) => this.props.history.replace({ query: { filters } });

  handleFilterReset = () => this.props.history.replace({ query: { filters: {} } });

  handleDeleteRule = uuid => async () => {
    const {
      notify,
      deleteRule,
      rules: { refetch },
      modals: { deleteModal },
    } = this.props;

    const response = await deleteRule({ variables: { uuid } });

    const { data: { rules: { deleteRule: { data, error } } } } = response;

    if (error) {
      deleteModal.hide();
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    } else {
      await refetch();
      deleteModal.hide();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED', { id: data.uuid }),
      });
    }
  };

  handleDeleteRuleClick = (uuid) => {
    const {
      modals: { deleteModal },
      rules: { rules, rulesRetention },
    } = this.props;

    const data = get(rules, 'data') || get(rulesRetention, 'data') || [];

    const { name } = data.find(({ uuid: ruleId }) => ruleId === uuid);

    deleteModal.show({
      onSubmit: this.handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT', { name }),
      submitButtonLabel: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE'),
    });
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

  renderRuleInfo = ({
    fieldName,
    translateMultiple,
    translateSingle,
    withUpperCase,
  }) => ({ [fieldName]: arr }) => (
    <Choose>
      <When condition={arr.length > 0}>
        <div className="font-weight-700">
          {`${arr.length} `}
          <Choose>
            <When condition={arr.length === 1}>
              {I18n.t(translateSingle)}
            </When>
            <Otherwise>
              {I18n.t(translateMultiple)}
            </Otherwise>
          </Choose>
        </div>
        <div className="font-size-12">
          {withUpperCase ? arr.join(', ').toUpperCase() : arr.join(', ')}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderPriority = ({ priority }) => (
    <div className="font-weight-700">
      {priority}
    </div>
  );

  renderPartner = ({ partners }) => (
    <Choose>
      <When condition={partners.length > 0}>
        <div className="font-weight-700">
          {`${partners.length} `}
          <Choose>
            <When condition={partners.length === 1}>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.PARTNER')}
            </When>
            <Otherwise>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.PARTNERS')}
            </Otherwise>
          </Choose>
        </div>
        {partners.map(partner => (
          <If condition={partner}>
            <div key={partner.uuid}>
              <Link to={`/partners/${partner.uuid}/profile`}>{partner.fullName}</Link>
            </div>
          </If>
        ))}
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderRemoveIcon = ({ uuid }) => (
    <button
      type="button"
      className="fa fa-trash btn-transparent color-danger"
      onClick={() => this.handleDeleteRuleClick(uuid)}
    />
  );

  render() {
    const {
      rules: {
        rules,
        loading,
      },
      location: { query },
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const entities = get(rules, 'data') || [];
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    const isDeleteRuleAvailable = (new Permissions(permissions.SALES_RULES.REMOVE_RULE)).check(currentPermissions);

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
              {entities.length} {I18n.t('SALES_RULES.TITLE')}
            </span>
          </Placeholder>
        </div>
        <RulesFilters
          initialValues={filters}
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          countries={countries}
        />

        <div className="card-body">
          <Grid
            data={entities}
            handleRowClick={this.handleOfficeClick}
            isLastPage
            withNoResults={!loading && entities.length === 0}
          >
            <GridColumn
              name="rule"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RULE')}
              render={this.renderRule}
            />
            <GridColumn
              name="countries"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.COUNTRY')}
              render={this.renderRuleInfo(infoConfig.countries)}
            />
            <GridColumn
              name="languages"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.LANGUAGE')}
              render={this.renderRuleInfo(infoConfig.languages)}
            />
            <GridColumn
              name="partners"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PARTNER')}
              render={this.renderPartner}
            />
            <GridColumn
              name="sources"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
              render={this.renderRuleInfo(infoConfig.sources)}
            />
            <GridColumn
              name="priority"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
              render={this.renderPriority}
            />
            <If condition={isDeleteRuleAvailable}>
              <GridColumn
                name="delete"
                header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
                render={this.renderRemoveIcon}
              />
            </If>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRouter(withPermission(SalesRules));
