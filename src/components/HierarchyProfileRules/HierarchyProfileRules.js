import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withNotifications, withModals } from 'hoc';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { branchTypes } from 'constants/hierarchyTypes';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { decodeNullValues } from 'components/Formik/utils';
import { actionRuleTypes, deskTypes } from 'constants/rules';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import Grid, { GridColumn } from 'components/Grid';
import TabHeader from 'components/TabHeader';
import Uuid from 'components/Uuid';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import {
  RulesQuery,
  BranchInfoQuery,
  BranchChildrenQuery,
  CreateRule,
  CreateRuleRetention,
  DeleteRule,
  DeleteRuleRetention,
} from './graphql';
import RuleModal from './components/RuleModal';
import EditRuleModal from './components/EditRuleModal';
import RulesFilters from './components/RulesGridFilters';
import infoConfig from './constants';

class HierarchyProfileRules extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    rulesQuery: PropTypes.query({
      rules: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.ruleType),
        error: PropTypes.object,
      }),
    }).isRequired,
    branchChildrenQuery: PropTypes.query({
      hierarchy: PropTypes.shape({
        branchChildren: PropTypes.shape({
          data: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        }),
      }),
    }).isRequired,
    branchInfoQuery: PropTypes.query({
      hierarchy: PropTypes.shape({
        branchInfo: PropTypes.shape({
          data: PropTypes.hierarchyBranch,
        }),
      }),
    }).isRequired,
    createRule: PropTypes.func.isRequired,
    createRuleRetention: PropTypes.func.isRequired,
    deleteRule: PropTypes.func.isRequired,
    deleteRuleRetention: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      ruleModal: PropTypes.modalType,
      ruleModalRetention: PropTypes.modalType,
      deleteModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    title: PropTypes.string.isRequired,
    deskType: PropTypes.string.isRequired,
    branchType: PropTypes.string.isRequired,
  };

  handleFiltersChanged = (filters = {}) => this.props.history.replace({ query: { filters } });

  handleFilterReset = () => this.props.history.replace({ query: { filters: {} } });

  triggerRuleModal = () => {
    const {
      deskType,
      modals: { ruleModal },
    } = this.props;

    ruleModal.show({
      onSubmit: (values, setErrors) => this.handleAddRule(values, setErrors),
      deskType,
    });
  };

  handleRenderButtonAddRule = (type) => {
    let data = {};

    switch (type) {
      case branchTypes.DESK: {
        const { branchChildrenQuery } = this.props;
        const teams = get(branchChildrenQuery, 'data.hierarchy.branchChildren.data');

        if (!branchChildrenQuery.loading) {
          data = {
            enabled: !!(teams && teams.length && teams.some(({ defaultUser }) => !!defaultUser)),
            message: I18n.t('HIERARCHY.PROFILE_RULE_TOOLTIP.DESK'),
          };
        }
        break;
      }
      case branchTypes.TEAM: {
        const { branchInfoQuery } = this.props;
        const branchInfo = get(branchInfoQuery, 'data.hierarchy.branchInfo.data');

        if (!branchInfoQuery.loading) {
          data = {
            enabled: !!branchInfo.defaultUser,
            message: I18n.t('HIERARCHY.PROFILE_RULE_TOOLTIP.TEAM'),
          };
        }
        break;
      }
      default: {
        data = { enabled: true };
      }
    }

    return this.renderButtonAddRule(data);
  };

  triggerEditRuleModal = (uuid) => {
    const {
      modals: { editRuleModal },
    } = this.props;

    editRuleModal.show({
      onSubmit: values => this.handleEditRule(values, uuid),
      uuid,
    });
  };

  handleEditRule = async (variables, uuid) => {
    const {
      notify,
      createRule,
      modals: { editRuleModal },
      match: { params: { id } },
      rulesQuery,
    } = this.props;

    const {
      data: {
        rules: {
          createRule: {
            error,
          },
        },
      },
    } = await createRule(
      {
        variables: {
          actions: [{
            parentBranch: id,
            ruleType: actionRuleTypes.ROUND_ROBIN,
          }],
          uuid,
          ...decodeNullValues(variables),
        },
      },
    );

    await rulesQuery.refetch();

    editRuleModal.hide();

    notify({
      level: error ? 'error' : 'success',
      title: error ? I18n.t('COMMON.FAIL') : I18n.t('COMMON.SUCCESS'),
      message: error
        ? I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_UPDATED')
        : I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_UPDATED'),
    });
  };

  handleAddRule = async (variables, setErrors) => {
    const {
      notify,
      createRule,
      createRuleRetention,
      modals: { ruleModal },
      match: { params: { id } },
      rulesQuery,
      deskType,
    } = this.props;

    let response;
    let createRuleType = 'createRule';

    if (deskType === deskTypes.RETENTION) {
      const { ruleType, ...data } = variables;
      createRuleType = 'createRuleRetention';
      response = await createRuleRetention(
        {
          variables: {
            actions: [{
              parentBranch: id,
              ruleType,
            }],
            ...decodeNullValues(data),
          },
        },
      );
    } else {
      response = await createRule(
        {
          variables: {
            actions: [{
              parentBranch: id,
              ruleType: actionRuleTypes.ROUND_ROBIN,
            }],
            ...decodeNullValues(variables),
          },
        },
      );
    }

    const { data: { rules: { [createRuleType]: { data, error } } } } = response;

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_CREATED'),
      });

      let _error = error.error;

      if (error.error === 'error.entity.already.exist') {
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
      await rulesQuery.refetch();

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
      deleteRuleRetention,
      rulesQuery,
      modals: { deleteModal },
      deskType,
    } = this.props;

    let response;
    let deleteRuleType = 'deleteRule';

    if (deskType === deskTypes.RETENTION) {
      deleteRuleType = 'deleteRuleRetention';
      response = await deleteRuleRetention({ variables: { uuid } });
    } else {
      response = await deleteRule({ variables: { uuid } });
    }

    const { data: { rules: { [deleteRuleType]: { data, error } } } } = response;

    if (error) {
      deleteModal.hide();

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    } else {
      await rulesQuery.refetch();

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
      rulesQuery: { data: rulesQueryData },
    } = this.props;

    const data = get(rulesQueryData, 'rules.data') || get(rulesQueryData, 'rulesRetention.data') || [];

    const { name } = data.find(({ uuid: ruleId }) => ruleId === uuid);

    deleteModal.show({
      onSubmit: this.handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT', { name }),
      submitButtonLabel: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE'),
    });
  };

  renderButtonAddRule = ({ enabled, message }) => (
    <PermissionContent permissions={permissions.SALES_RULES.CREATE_RULE}>
      <TabHeader title={I18n.t(this.props.title)}>
        <button
          id="add-rule"
          type="submit"
          className={classNames(!enabled && 'disabled', 'btn btn-sm btn-outline')}
          onClick={enabled ? this.triggerRuleModal : null}
        >
          + {I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}
        </button>
      </TabHeader>

      <If condition={!enabled && message}>
        <UncontrolledTooltip
          placement="bottom"
          target="add-rule"
        >
          {message}
        </UncontrolledTooltip>
      </If>
    </PermissionContent>
  );

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

  renderActions = ({ uuid }) => (
    <>
      <Button
        transparent
        onClick={() => this.handleDeleteRuleClick(uuid)}
      >
        <i className="fa fa-trash btn-transparent color-danger" />
      </Button>
      <If condition={this.props.deskType !== deskTypes.RETENTION}>
        <Button
          transparent
        >
          <i
            onClick={() => this.triggerEditRuleModal(uuid)}
            className="font-size-16 cursor-pointer fa fa-edit float-right"
          />
        </Button>
      </If>
    </>
  );

  render() {
    const {
      rulesQuery: {
        data: rulesQueryData,
        loading,
      },
      permission: {
        permissions: currentPermissions,
      },
      branchType,
      deskType,
    } = this.props;

    const error = get(rulesQueryData, 'rules.error') || get(rulesQueryData, 'rulesRetention.error');

    if (error) {
      return null;
    }

    const entities = get(rulesQueryData, 'rules.data') || get(rulesQueryData, 'rulesRetention.data') || [];

    const isDeleteRuleAvailable = (new Permissions(permissions.SALES_RULES.REMOVE_RULE)).check(currentPermissions);

    return (
      <Fragment>
        {this.handleRenderButtonAddRule(branchType)}

        <RulesFilters
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
        />

        <div className="card-body">
          <Grid
            data={entities}
            handleRowClick={this.handleOfficeClick}
            isLoading={loading}
            isLastPage
          >
            <GridColumn
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RULE')}
              render={this.renderRule}
            />
            <GridColumn
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.COUNTRY')}
              render={this.renderRuleInfo(infoConfig.countries)}
            />
            <GridColumn
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.LANGUAGE')}
              render={this.renderRuleInfo(infoConfig.languages)}
            />
            <If condition={deskType === deskTypes.SALES}>
              <GridColumn
                header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PARTNER')}
                render={this.renderPartner}
              />
              <GridColumn
                header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
                render={this.renderRuleInfo(infoConfig.sources)}
              />
            </If>
            <GridColumn
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
              render={this.renderPriority}
            />
            <If condition={isDeleteRuleAvailable}>
              <GridColumn
                header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
                render={this.renderActions}
              />
            </If>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default (title, deskType, branchType) => props => (
  React.createElement(
    compose(
      withPermission,
      withNotifications,
      withModals({
        ruleModal: RuleModal,
        editRuleModal: EditRuleModal,
        deleteModal: ConfirmActionModal,
      }),
      withRequests({
        rulesQuery: RulesQuery,
        branchInfoQuery: BranchInfoQuery,
        branchChildrenQuery: BranchChildrenQuery,
        createRule: CreateRule,
        createRuleRetention: CreateRuleRetention,
        deleteRule: DeleteRule,
        deleteRuleRetention: DeleteRuleRetention,
      }),
    )(HierarchyProfileRules),
    { title, deskType, branchType, ...props },
  )
);
