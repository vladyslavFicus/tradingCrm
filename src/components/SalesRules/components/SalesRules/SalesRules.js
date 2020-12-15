import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import countries from 'utils/countryList';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import { Button, EditButton } from 'components/UI';
import Grid, { GridColumn } from 'components/Grid';
import Placeholder from 'components/Placeholder';
import Permissions from 'utils/permissions';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import CreateRuleModal from 'modals/CreateRuleModal';
import UpdateRuleModal from 'modals/UpdateRuleModal';
import RulesFilters from 'components/HierarchyProfileRules/components/RulesGridFilters';
import infoConfig from './constants';
import './SalesRules.scss';
import {
  OperatorsQuery,
  PartnersQuery,
  GetRulesQuery,
  DeleteRuleMutation,
} from '../graphql';

class SalesRules extends PureComponent {
  static propTypes = {
    rulesQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.ruleType)).isRequired,
    deleteRule: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      createRuleModal: PropTypes.modalType,
      deleteModal: PropTypes.modalType,
      updateRuleModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    operators: PropTypes.query({
      operators: PropTypes.shape({
        content: PropTypes.operatorsList,
      }),
    }).isRequired,
    partners: PropTypes.query({
      partners: PropTypes.shape({
        content: PropTypes.partnersList,
      }),
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    type: PropTypes.string,
    isTab: PropTypes.bool,
  };

  static defaultProps = {
    type: null,
    isTab: false,
  };

  openCreateRuleModal = () => {
    const {
      modals: {
        createRuleModal,
      },
      rulesQuery: {
        refetch,
      },
      type: userType,
    } = this.props;

    createRuleModal.show({
      userType,
      withOperatorSpreads: true,
      onSuccess: async () => {
        await refetch();
        createRuleModal.hide();
      },
    });
  };

  openUpdateRuleModal = (uuid) => {
    const {
      modals: {
        updateRuleModal,
      },
      rulesQuery: {
        refetch,
      },
    } = this.props;

    updateRuleModal.show({
      uuid,
      onSuccess: async () => {
        await refetch();
        updateRuleModal.hide();
      },
    });
  };

  handleDeleteRule = uuid => async () => {
    const {
      notify,
      deleteRule,
      rulesQuery: { refetch },
      modals: { deleteModal },
    } = this.props;

    try {
      await deleteRule({ variables: { uuid } });

      await refetch();
      deleteModal.hide();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    }
  };

  handleDeleteRuleClick = (uuid) => {
    const {
      modals: { deleteModal },
      rulesQuery: {
        data,
      },
    } = this.props;

    const rules = data?.rules || [];
    const { name } = rules.find(({ uuid: ruleId }) => ruleId === uuid);

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

  renderActions = ({ uuid }) => (
    <>
      <Button
        transparent
        onClick={() => this.handleDeleteRuleClick(uuid)}
      >
        <i className="fa fa-trash btn-transparent color-danger" />
      </Button>
      <EditButton
        className="SalesRules__edit-button"
        onClick={() => this.openUpdateRuleModal(uuid)}
      />
    </>
  );

  renderOperator = ({ operatorSpreads }) => (
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

  renderRatio = ({ operatorSpreads }) => (
    <Choose>
      <When condition={operatorSpreads && operatorSpreads.length > 0}>
        <div className="margin-top-20">
          {operatorSpreads.map(({ operator, percentage }) => (
            <If condition={operator}>
              <div key={operator.uuid}>
                <div className="font-weight-700">
                  <Choose>
                    <When condition={percentage}>
                      <span>{percentage} %</span>
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

  render() {
    const {
      rulesQuery,
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
      isTab,
    } = this.props;

    const entities = get(rulesQuery, 'data.rules') || [];
    const filters = get(query, 'filters', {});
    const isLoadingRules = rulesQuery.loading;

    const operators = get(operatorsData, 'operators.content') || [];
    const partners = get(partnersData, 'partners.content') || [];

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    const isDeleteRuleAvailable = (new Permissions(permissions.SALES_RULES.REMOVE_RULE)).check(currentPermissions);

    return (
      <div className={classNames('SalesRules card', { 'no-borders': isTab })}>
        <div className="card-heading card-heading--is-sticky">
          <Placeholder
            ready={!isLoadingRules}
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
                onClick={this.openCreateRuleModal}
              >
                {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
              </Button>
            </div>
          </PermissionContent>
        </div>

        <RulesFilters
          disabled={!allowActions}
          handleRefetch={rulesQuery.refetch}
          countries={countries}
          partners={partners}
          operators={operators}
          type={type}
        />

        <div className="SalesRules__grid">
          <Grid
            data={entities}
            isLoading={isLoadingRules}
            isLastPage
            headerStickyFromTop={127}
            withNoResults={!isLoadingRules && entities.length === 0}
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
                render={this.renderActions}
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
  withRouter,
  withModals({
    deleteModal: ConfirmActionModal,
    createRuleModal: CreateRuleModal,
    updateRuleModal: UpdateRuleModal,
  }),
  withNotifications,
  withRequests({
    operators: OperatorsQuery,
    partners: PartnersQuery,
    deleteRule: DeleteRuleMutation,
    rulesQuery: GetRulesQuery,
  }),
)(SalesRules);
