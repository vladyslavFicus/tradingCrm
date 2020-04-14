import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { TextRow } from 'react-placeholder/lib/placeholders';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import countries from 'utils/countryList';
import { actionRuleTypes, deskTypes } from 'constants/rules';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import Grid, { GridColumn } from 'components/Grid';
import Placeholder from 'components/Placeholder';
import { decodeNullValues } from 'components/Formik/utils';
import Permissions from 'utils/permissions';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import RuleModal from 'components/HierarchyProfileRules/components/RuleModal';
import RulesFilters from 'components/HierarchyProfileRules/components/RulesGridFilters';
import infoConfig from './constants';
import {
  OperatorsQuery,
  PartnersQuery,
  GetRulesQuery,
  DeleteRuleMutation,
  CreateRuleMutation,
} from '../graphql';

class SalesRules extends PureComponent {
  static propTypes = {
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
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    operators: PropTypes.query({
      operators: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.operatorsList,
        }),
      }),
    }).isRequired,
    partners: PropTypes.query({
      partners: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.partnersList,
        }),
      }),
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: null,
  };

  handleFiltersChanged = (filters = {}) => this.props.history.replace({ query: { filters } });

  handleFilterReset = () => this.props.history.replace({ query: { filters: {} } });

  triggerRuleModal = () => {
    const {
      modals: { ruleModal },
    } = this.props;

    ruleModal.show({
      onSubmit: (values, setErrors) => this.handleAddRule(values, setErrors),
      deskType: deskTypes.SALES,
      withOperatorSpreads: true,
    });
  };

  handleAddRule = async ({ operatorSpreads, ...rest }, setErrors) => {
    const {
      notify,
      createRule,
      modals: { ruleModal },
      match: { params: { id } },
      rules: { refetch },
    } = this.props;

    const { data: { rules: { createRule: { data, error } } } } = await createRule(
      {
        variables: {
          actions: [{
            parentUser: id,
            ruleType: actionRuleTypes.ROUND_ROBIN,
            operatorSpreads: [
              // filter need for delete empty value in array
              ...operatorSpreads.filter(item => item && item.percentage),
            ],
          }],
          ...decodeNullValues(rest),
        },
      },
    );

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_CREATED'),
      });

      let _error = error.error;

      if (_error === 'error.entity.already.exist') {
        _error = (
          <>
            <div>
              <Link
                to={{
                  pathname: '/sales-rules',
                  query: { filters: { createdByOrUuid: error.errorParameters.ruleUuid } },
                }}
              >
                {I18n.t(`rules.${error.error}`, error.errorParameters)}
              </Link>
            </div>
            <Uuid uuid={error.errorParameters.ruleUuid} uuidPrefix="RL" />
          </>
        );
      }

      setErrors({ submit: _error });
    } else {
      await refetch();
      ruleModal.hide();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_CREATED', { id: data.uuid }),
      });
    }
  };

  handleDeleteRule = uuid => async () => {
    const {
      notify,
      deleteRule,
      rules: { refetch },
      modals: { deleteModal },
    } = this.props;

    const { data: { rules: { deleteRule: { data, error } } } } = await deleteRule({ variables: { uuid } });

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
      rules: {
        data: {
          rules,
          rulesRetention,
        },
      },
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
        {partners.map(({ uuid, fullName }) => (
          <div key={uuid}>
            <Link to={`/partners/${uuid}/profile`}>{fullName}</Link>
          </div>
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

  renderOperator = ({ actions }) => {
    const [{ operatorSpreads }] = actions;

    return (
      <Choose>
        <When condition={operatorSpreads && operatorSpreads.length > 0}>
          <div className="font-weight-700">
            {`${operatorSpreads.length} `}
            <Choose>
              <When condition={operatorSpreads.length === 1}>
                {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.OPERATOR')}
              </When>
              <Otherwise>
                {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.OPERATORS')}
              </Otherwise>
            </Choose>
          </div>
          {operatorSpreads.map(({ operator }) => (
            <If condition={operator}>
              <div key={operator.uuid}>
                <Link to={`/operators/${operator.uuid}/profile`}>{operator.fullName}</Link>
              </div>
            </If>
          ))}
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  }

  renderRatio = ({ actions }) => {
    const [{ operatorSpreads }] = actions;

    return (
      <Choose>
        <When condition={operatorSpreads && operatorSpreads.length > 0}>
          <div className="margin-top-20">
            {operatorSpreads.map(({ operator, percentage }) => (
              <If condition={operator}>
                <div key={operator.uuid}>
                  <div className="font-weight-700">
                    <Choose>
                      <When condition={percentage}>
                        <span>{percentage} &#37;</span>
                      </When>
                      <Otherwise>
                        <span>&mdash;</span>
                      </Otherwise>
                    </Choose>
                  </div>
                </div>
              </If>
            ))}
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  }

  render() {
    const {
      rules: {
        data,
        loading,
      },
      location: { query },
      permission: {
        permissions: currentPermissions,
      },
      operators: {
        data: operatorsData,
      },
      partners: {
        data: partnersData,
      },
      type,
    } = this.props;

    const entities = get(data, 'rules.data') || [];
    const filters = get(query, 'filters', {});

    const operators = get(operatorsData, 'operators.data.content') || [];
    const partners = get(partnersData, 'partners.data.content') || [];

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
          <PermissionContent permissions={permissions.SALES_RULES.CREATE_RULE}>
            <div className="ml-auto">
              <Button
                id="add-rule"
                type="submit"
                small
                commonOutline
                onClick={this.triggerRuleModal}
              >
                + {I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}
              </Button>
            </div>
          </PermissionContent>
        </div>
        <RulesFilters
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          countries={countries}
          partners={partners}
          operators={operators}
          type={type}
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
              name="priority"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
              render={this.renderPriority}
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
              name="operators"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.OPERATOR')}
              render={this.renderOperator}
            />
            <GridColumn
              name="ratio"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RATIO')}
              render={this.renderRatio}
            />
            <GridColumn
              name="sources"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
              render={this.renderRuleInfo(infoConfig.sources)}
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

export default compose(
  withPermission,
  withModals({
    deleteModal: ConfirmActionModal,
    ruleModal: RuleModal,
  }),
  withNotifications,
  withRequests({
    operators: OperatorsQuery,
    partners: PartnersQuery,
    createRule: CreateRuleMutation,
    deleteRule: DeleteRuleMutation,
    rules: GetRulesQuery,
  }),
)(SalesRules);