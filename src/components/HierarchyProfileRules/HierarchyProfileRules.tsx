import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { useLocation } from 'react-router-dom';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import { LevelType, notify } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { branchTypes } from 'constants/hierarchyTypes';
import { Modal, State } from 'types';
import { HierarchyBranch } from '__generated__/types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import CreateRuleModal from 'modals/CreateRuleModal';
import UpdateRuleModal from 'modals/UpdateRuleModal';
import { Button, EditButton, TrashButton } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { Table, Column } from 'components/Table';
import TabHeader from 'components/TabHeader';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import infoConfig from './constants';
import { RulesQuery, RulesQueryVariables, useRulesQuery } from './graphql/__generated__/RulesQuery';
import { useDeleteRule } from './graphql/__generated__/DeleteRuleMutation';
import RulesGridFilters from './components/RulesGridFilters';
import './HierarchyProfileRules.scss';

type RuleInfo = {
  fieldName: string,
  translateMultiple: string,
  translateSingle: string,
  withUpperCase?: boolean,
};

type Rule = ExtractApolloTypeFromArray<RulesQuery['rules']>;

type Modals = {
  createRuleModal: Modal,
  updateRuleModal: Modal,
  deleteModal: Modal,
};

type Props = {
  branchChildren: Array<HierarchyBranch>,
  branchInfo: HierarchyBranch,
  modals: Modals,
  params: {
    id: string,
  },
  title: string,
  branchType?: branchTypes,
};

const HierarchyProfileRules = (props: Props) => {
  const {
    modals: {
      createRuleModal,
      updateRuleModal,
      deleteModal,
    },
    params: {
      id: parentBranch,
    },
    title,
    branchType,
    branchChildren,
    branchInfo,
  } = props;

  const [DeleteRule] = useDeleteRule();
  const { state } = useLocation<State<RulesQueryVariables>>();
  const { data, loading, error, refetch } = useRulesQuery({
    variables: {
      ...state?.filters as RulesQueryVariables,
    },
  });
  const rules = data?.rules || [];

  const openCreateRuleModal = () => {
    createRuleModal.show({
      parentBranch,
      onSuccess: async () => {
        await refetch();

        createRuleModal.hide();
      },
    });
  };

  const openUpdateRuleModal = (rule: Rule) => {
    const { uuid } = rule;

    updateRuleModal.show({
      uuid,
      onSuccess: async () => {
        await refetch();

        updateRuleModal.hide();
      },
    });
  };

  const handleDeleteRule = (uuid: string) => async () => {
    try {
      await DeleteRule({ variables: { uuid } });

      await refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED', { id: uuid }),
      });

      deleteModal.hide();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    }
  };

  const handleDeleteRuleClick = (chooseRule: Rule) => {
    const { uuid } = chooseRule;

    const result = rules.find(rule => rule?.uuid === uuid);
    const name = result?.name;

    deleteModal.show({
      onSubmit: handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT', { name }),
      submitButtonLabel: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE'),
    });
  };

  const renderAddButtonWithTooltip = () => {
    let disabled = false;
    let tooltipMessage = '';

    switch (branchType) {
      case branchTypes.DESK: {
        const teams = branchChildren;

        disabled = !(teams && teams.length && teams.some(({ uuid }) => !!uuid));
        tooltipMessage = I18n.t('HIERARCHY.PROFILE_RULE_TOOLTIP.DESK');

        break;
      }
      case branchTypes.TEAM: {
        const defaultUser = branchInfo?.defaultUser;

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
        <span id="add-rule">
          <Button
            type="submit"
            onClick={openCreateRuleModal}
            disabled={disabled}
            tertiary
            small
          >
            {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
          </Button>
        </span>

        <If condition={disabled && !!tooltipMessage}>
          <UncontrolledTooltip
            placement="bottom"
            target="add-rule"
            delay={{ show: 350, hide: 250 }}
            fade={false}
          >
            {tooltipMessage}
          </UncontrolledTooltip>
        </If>
      </>
    );
  };

  const renderRule = ({ uuid, name, createdBy }: Rule) => (
    <div className="HierarchyProfileRules__rule">
      <div className="HierarchyProfileRules__rule-name">
        {name}
      </div>

      <If condition={!!uuid}>
        <div className="HierarchyProfileRules__rule-uuid">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>

      <If condition={!!createdBy}>
        <div className="HierarchyProfileRules__rule-uuid">
          <Uuid uuid={createdBy || ''} uuidPrefix="OP" />
        </div>
      </If>
    </div>
  );

  const renderRuleInfo = (
    { fieldName, translateSingle, translateMultiple, withUpperCase }: RuleInfo,
  ) => (row: Rule) => {
    const arr = row[fieldName as keyof Rule] as Array<string>;

    return (
      <Choose>
        <When condition={arr?.length > 0}>
          <div className="HierarchyProfileRules__info">
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

          <div className="HierarchyProfileRules__info-text">
            {withUpperCase ? arr.join(', ').toUpperCase() : arr.join(', ')}
          </div>
        </When>

        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  };

  const renderPriority = (rule: Rule) => {
    const { priority } = rule;

    return (
      <div className="HierarchyProfileRules__priority">
        {priority}
      </div>
    );
  };

  const renderPartner = (rule: Rule) => {
    const { partners } = rule;

    return (
      <Choose>
        <When condition={partners.length > 0}>
          <div className="HierarchyProfileRules__partner">
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
            <If condition={!!partner}>
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
  };

  const renderActions = (rule: Rule) => (
    <>
      <TrashButton onClick={() => handleDeleteRuleClick(rule)} />

      <EditButton
        onClick={() => openUpdateRuleModal(rule)}
        className="HierarchyProfileRules__edit-icon"
      />
    </>
  );

  if (error) {
    return null;
  }

  const permission = usePermission();
  const isDeleteRuleAvailable = permission.allows(permissions.SALES_RULES.REMOVE_RULE);

  return (
    <div className="HierarchyProfileRules">
      <TabHeader
        title={I18n.t(title)}
        className="HierarchyProfileRules__header"
      >
        <PermissionContent permissions={permissions.SALES_RULES.CREATE_RULE}>
          {renderAddButtonWithTooltip()}
        </PermissionContent>
      </TabHeader>

      <RulesGridFilters
        handleRefetch={refetch}
      />

      <Table
        stickyFromTop={112}
        items={rules}
        loading={loading}
      >
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RULE')}
          render={renderRule}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.COUNTRY')}
          render={renderRuleInfo(infoConfig.countries)}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.LANGUAGE')}
          render={renderRuleInfo(infoConfig.languages)}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PARTNER')}
          render={renderPartner}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
          render={renderRuleInfo(infoConfig.sources)}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
          render={renderPriority}
        />

        <If condition={isDeleteRuleAvailable}>
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    createRuleModal: CreateRuleModal,
    updateRuleModal: UpdateRuleModal,
    deleteModal: ConfirmActionModal,
  }),
)(HierarchyProfileRules);
