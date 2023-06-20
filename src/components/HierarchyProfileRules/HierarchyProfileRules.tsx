import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
import { Rule } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { LevelType, notify } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import CreateRuleModal, { CreateRuleModalProps } from 'modals/CreateRuleModal';
import UpdateRuleModal, { UpdateRuleModalProps } from 'modals/UpdateRuleModal';
import { Button, EditButton, TrashButton } from 'components/Buttons';
import { Table, Column } from 'components/Table';
import TabHeader from 'components/TabHeader';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import infoConfig from './constants';
import RulesGridFilters from './components/RulesGridFilters';
import { RulesQueryVariables, useRulesQuery } from './graphql/__generated__/RulesQuery';
import { useDeleteRule } from './graphql/__generated__/DeleteRuleMutation';
import './HierarchyProfileRules.scss';

type RuleInfo = {
  fieldName: string,
  translateMultiple: string,
  translateSingle: string,
  withUpperCase?: boolean,
};

type Props = {
  branchId: string,
  title: string,
};

const HierarchyProfileRules = (props: Props) => {
  const { branchId, title } = props;

  const { state } = useLocation<State<RulesQueryVariables>>();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const createRuleModal = useModal<CreateRuleModalProps>(CreateRuleModal);
  const updateRuleModal = useModal<UpdateRuleModalProps>(UpdateRuleModal);

  // ===== Requests ===== //
  const [DeleteRule] = useDeleteRule();
  const { data, loading, error, refetch } = useRulesQuery({
    variables: {
      ...state?.filters as RulesQueryVariables,
      branchUuid: branchId,
    },
  });
  const rules = data?.rules || [];

  // ===== Handlers ===== //
  const handleOpenCreateRuleModal = () => {
    createRuleModal.show({
      parentBranch: branchId,
      onSuccess: async () => {
        await refetch();

        createRuleModal.hide();
      },
    });
  };

  const handleOpenUpdateRuleModal = (rule: Rule) => {
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

      confirmActionModal.hide();
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

    confirmActionModal.show({
      onSubmit: handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT', { name }),
      submitButtonLabel: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE'),
    });
  };

  // ===== Renders ===== //
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
          &mdash;
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
          &mdash;
        </Otherwise>
      </Choose>
    );
  };

  const renderActions = (rule: Rule) => (
    <>
      <TrashButton
        data-testid="HierarchyProfileRules-trashButton"
        onClick={() => handleDeleteRuleClick(rule)}
      />

      <EditButton
        data-testid="HierarchyProfileRules-editRuleButton"
        onClick={() => handleOpenUpdateRuleModal(rule)}
        className="HierarchyProfileRules__edit-icon"
      />
    </>
  );

  if (error) {
    return null;
  }

  const permission = usePermission();

  const isCreateRuleAllow = permission.allows(permissions.SALES_RULES.CREATE_RULE);
  const isDeleteRuleAllow = permission.allows(permissions.SALES_RULES.REMOVE_RULE);

  return (
    <div className="HierarchyProfileRules">
      <TabHeader
        title={title}
        className="HierarchyProfileRules__header"
      >
        <If condition={isCreateRuleAllow}>
          <Button
            data-testid="HierarchyProfileRules-addRuleButton"
            type="submit"
            onClick={handleOpenCreateRuleModal}
            tertiary
            small
          >
            {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
          </Button>
        </If>
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

        <If condition={isDeleteRuleAllow}>
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(HierarchyProfileRules);
