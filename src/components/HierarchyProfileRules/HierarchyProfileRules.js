import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications, withModals } from 'hoc';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { branchTypes } from 'constants/hierarchyTypes';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/rules';
import { Button } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import Grid, { GridColumn } from 'components/Grid';
import TabHeader from 'components/TabHeader';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import CreateRuleModal from 'modals/CreateRuleModal';
import UpdateRuleModal from 'modals/UpdateRuleModal';
import {
  RulesQuery,
  BranchInfoQuery,
  BranchChildrenQuery,
  DeleteRule,
} from './graphql';
import RulesFilters from './components/RulesGridFilters';
import infoConfig from './constants';
import './HierarchyProfileRules.scss';

class HierarchyProfileRules extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    rulesQuery: PropTypes.query({
      rules: PropTypes.arrayOf(PropTypes.ruleType),
    }).isRequired,
    branchChildrenQuery: PropTypes.query({
      branchChildren: PropTypes.arrayOf(PropTypes.hierarchyBranch),
    }).isRequired,
    branchInfoQuery: PropTypes.query({
      branchInfo: PropTypes.hierarchyBranch,
    }).isRequired,
    deleteRule: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      createRuleModal: PropTypes.modalType,
      updateRuleModal: PropTypes.modalType,
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

  openCreateRuleModal = () => {
    const {
      modals: {
        createRuleModal,
      },
      match: {
        params: {
          id: parentBranch,
        },
      },
      rulesQuery: {
        refetch,
      },
    } = this.props;

    createRuleModal.show({
      parentBranch,
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
      match: {
        params: {
          id: parentBranch,
        },
      },
      rulesQuery: {
        refetch,
      },
    } = this.props;

    updateRuleModal.show({
      uuid,
      parentBranch,
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
      rulesQuery,
      modals: { deleteModal },
    } = this.props;

    try {
      await deleteRule({ variables: { uuid } });

      await rulesQuery.refetch();

      deleteModal.hide();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED', { id: uuid }),
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
      rulesQuery: { data },
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

  renderAddButtonWithTooltip = () => {
    const { branchType, branchChildrenQuery, branchInfoQuery } = this.props;

    let disabled = false;
    let tooltipMessage = '';

    switch (branchType) {
      case branchTypes.DESK: {
        const teams = branchChildrenQuery.data?.branchChildren;

        disabled = !(teams && teams.length && teams.some(({ uuid }) => !!uuid));
        tooltipMessage = I18n.t('HIERARCHY.PROFILE_RULE_TOOLTIP.DESK');

        break;
      }
      case branchTypes.TEAM: {
        const defaultUser = branchInfoQuery.data?.branchInfo?.defaultUser;

        disabled = !defaultUser;
        tooltipMessage = I18n.t('HIERARCHY.PROFILE_RULE_TOOLTIP.TEAM');

        break;
      }
      default: {
        break;
      }
    }

    return (
      <>
        <Button
          id="add-rule"
          type="submit"
          onClick={this.openCreateRuleModal}
          disabled={disabled}
          commonOutline
          small
        >
          {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
        </Button>

        <If condition={disabled && tooltipMessage}>
          <UncontrolledTooltip
            placement="bottom"
            target="add-rule"
          >
            {tooltipMessage}
          </UncontrolledTooltip>
        </If>
      </>
    );
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

  renderActions = ({ uuid }) => (
    <>
      <Button
        transparent
        onClick={() => this.handleDeleteRuleClick(uuid)}
      >
        <i className="fa fa-trash btn-transparent color-danger" />
      </Button>
      <Button
        transparent
      >
        <i
          onClick={() => this.openUpdateRuleModal(uuid)}
          className="font-size-16 cursor-pointer fa fa-edit float-right"
        />
      </Button>
    </>
  );

  render() {
    const {
      rulesQuery: {
        data,
        loading,
        refetch,
      },
      permission: {
        permissions: currentPermissions,
      },
      deskType,
      title,
    } = this.props;

    if (data?.error) {
      return null;
    }

    const entities = data?.rules || [];

    const isDeleteRuleAvailable = (new Permissions(permissions.SALES_RULES.REMOVE_RULE)).check(currentPermissions);

    return (
      <div className="HierarchyProfileRules">
        <TabHeader
          title={I18n.t(title)}
          className="HierarchyProfileRules__header"
        >
          <PermissionContent permissions={permissions.SALES_RULES.CREATE_RULE}>
            <If condition={deskType.toUpperCase() !== 'RETENTION'}>
              {this.renderAddButtonWithTooltip()}
            </If>
          </PermissionContent>
        </TabHeader>

        <RulesFilters
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          handleRefetch={refetch}
        />

        <div className="HierarchyProfileRules__grid">
          <Grid
            data={entities}
            isLoading={loading}
            headerStickyFromTop={113}
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
            </If>
            <If condition={deskType === deskTypes.SALES}>
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
      </div>
    );
  }
}

export default (title, deskType, branchType) => props => (
  React.createElement(
    compose(
      withPermission,
      withNotifications,
      withModals({
        createRuleModal: CreateRuleModal,
        updateRuleModal: UpdateRuleModal,
        deleteModal: ConfirmActionModal,
      }),
      withRequests({
        rulesQuery: RulesQuery,
        branchInfoQuery: BranchInfoQuery,
        branchChildrenQuery: BranchChildrenQuery,
        deleteRule: DeleteRule,
      }),
    )(HierarchyProfileRules),
    { title, deskType, branchType, ...props },
  )
);
