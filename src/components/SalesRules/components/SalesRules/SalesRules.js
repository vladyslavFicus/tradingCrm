import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import { notify, LevelType } from 'providers/NotificationProvider';
import Placeholder from 'components/Placeholder';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import { Button, EditButton, TrashButton } from 'components/Buttons';
import { Table, Column } from 'components/Table';
import Permissions from 'utils/permissions';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import CreateRuleModal from 'modals/CreateRuleModal';
import UpdateRuleModal from 'modals/UpdateRuleModal';
import RulesGridFilters from 'components/HierarchyProfileRules/components/RulesGridFilters';
import {
  OperatorsQuery,
  PartnersQuery,
  GetRulesQuery,
  DeleteRuleMutation,
} from '../graphql';
import infoConfig from './constants';
import './SalesRules.scss';

class SalesRules extends PureComponent {
  static propTypes = {
    rulesQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.ruleType)).isRequired,
    deleteRule: PropTypes.func.isRequired,
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
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
      match: {
        params: {
          id: parentBranch,
        },
      },
      rulesQuery: {
        refetch,
      },
      type: userType,
    } = this.props;

    createRuleModal.show({
      parentBranch,
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
      deleteRule,
      rulesQuery: { refetch },
      modals: { deleteModal },
    } = this.props;

    try {
      await deleteRule({ variables: { uuid } });

      await refetch();
      deleteModal.hide();
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
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
      <div className="SalesRules__text-primary">
        {name}
      </div>
      <If condition={uuid}>
        <div className="SalesRules__uuid SalesRules__text-secondary">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>
      <If condition={createdBy}>
        <div className="SalesRules__uuid SalesRules__text-secondary">
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
        <div className="SalesRules__text-primary">
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
        <div className="SalesRules__text-secondary">
          {withUpperCase ? arr.join(', ').toUpperCase() : arr.join(', ')}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderPriority = ({ priority }) => (
    <div className="SalesRules__text-primary">
      {priority}
    </div>
  );

  renderPartner = ({ partners }) => (
    <Choose>
      <When condition={partners.length > 0}>
        <div className="SalesRules__text-primary">
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
      <TrashButton onClick={() => this.handleDeleteRuleClick(uuid)} />
      <EditButton
        className="SalesRules__edit-button"
        onClick={() => this.openUpdateRuleModal(uuid)}
      />
    </>
  );

  renderOperator = ({ operatorSpreads }) => (
    <Choose>
      <When condition={operatorSpreads && operatorSpreads.length > 0}>
        <div className="SalesRules__text-primary">
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
                <div className="SalesRules__text-primary">
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
    const isLoadingRules = rulesQuery.loading;

    const operators = get(operatorsData, 'operators.content') || [];
    const partners = get(partnersData, 'partners.content') || [];

    const isDeleteRuleAvailable = (new Permissions(permissions.SALES_RULES.REMOVE_RULE)).check(currentPermissions);

    return (
      <div className={classNames('SalesRules', { 'SalesRules--no-borders': isTab })}>
        <div className="SalesRules__header">
          <Placeholder
            ready={!isLoadingRules}
            rows={[{ width: 220, height: 20 }]}
          >
            <span>
              <strong>{entities.length} </strong>
              {I18n.t('SALES_RULES.TITLE')}
            </span>
          </Placeholder>
          <PermissionContent permissions={permissions.SALES_RULES.CREATE_RULE}>
            <Button
              id="add-rule"
              type="submit"
              small
              tertiary
              onClick={this.openCreateRuleModal}
            >
              {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
            </Button>
          </PermissionContent>
        </div>

        <RulesGridFilters
          handleRefetch={rulesQuery.refetch}
          partners={partners}
          operators={operators}
          type={type}
        />

        <Table
          stickyFromTop={126}
          items={entities}
          loading={isLoadingRules}
        >
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RULE')}
            render={this.renderRule}
          />
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.COUNTRY')}
            render={this.renderRuleInfo(infoConfig.countries)}
          />
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
            render={this.renderPriority}
          />
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.LANGUAGE')}
            render={this.renderRuleInfo(infoConfig.languages)}
          />
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PARTNER')}
            render={this.renderPartner}
          />
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.OPERATOR')}
            render={this.renderOperator}
          />
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RATIO')}
            render={this.renderRatio}
          />
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
            render={this.renderRuleInfo(infoConfig.sources)}
          />
          <If condition={isDeleteRuleAvailable}>
            <Column
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
              render={this.renderActions}
            />
          </If>
        </Table>
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
  withRequests({
    operators: OperatorsQuery,
    partners: PartnersQuery,
    deleteRule: DeleteRuleMutation,
    rulesQuery: GetRulesQuery,
  }),
)(SalesRules);
