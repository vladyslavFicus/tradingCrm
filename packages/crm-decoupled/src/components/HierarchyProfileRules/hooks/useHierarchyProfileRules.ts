import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Config, useModal, notify, usePermission, Types } from '@crm/common';
import { Rule } from '__generated__/types';
import { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import ConfirmActionModal from 'modals/ConfirmActionModal/ConfirmActionModal';
import { CreateRuleModalProps } from 'modals/CreateRuleModal';
import CreateRuleModal from 'modals/CreateRuleModal/CreateRuleModal';
import { UpdateRuleModalProps } from 'modals/UpdateRuleModal';
import UpdateRuleModal from 'modals/UpdateRuleModal/UpdateRuleModal';
import { RulesQueryVariables, useRulesQuery } from 'components/RulesGridFilter/graphql/__generated__/RulesQuery';
import { useDeleteRule } from '../graphql/__generated__/DeleteRuleMutation';

export type RuleInfo = {
  fieldName: string,
  translateMultiple: string,
  translateSingle: string,
  withUpperCase?: boolean,
};

type Props = {
  branchId: string,
};

const useHierarchyProfileRules = (props: Props) => {
  const { branchId } = props;

  const state = useLocation().state as Types.State<RulesQueryVariables>;

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

  const handleOpenCreateRuleModal = useCallback(() => {
    createRuleModal.show({
      parentBranch: branchId,
      onSuccess: async () => {
        await refetch();

        createRuleModal.hide();
      },
    });
  }, [branchId]);

  const handleOpenUpdateRuleModal = useCallback((rule: Rule) => {
    const { uuid } = rule;

    updateRuleModal.show({
      uuid,
      onSuccess: async () => {
        await refetch();

        updateRuleModal.hide();
      },
    });
  }, []);

  const handleDeleteRule = useCallback((uuid: string) => async () => {
    try {
      await DeleteRule({ variables: { uuid } });

      await refetch();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED', { id: uuid }),
      });

      confirmActionModal.hide();
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    }
  }, []);

  const handleDeleteRuleClick = useCallback((chooseRule: Rule) => {
    const { uuid } = chooseRule;

    const result = rules.find(rule => rule?.uuid === uuid);
    const name = result?.name;

    confirmActionModal.show({
      onSubmit: handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT', { name }),
      submitButtonLabel: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE'),
    });
  }, [rules]);

  const permission = usePermission();

  const isCreateRuleAllow = permission.allows(Config.permissions.SALES_RULES.CREATE_RULE);
  const isDeleteRuleAllow = permission.allows(Config.permissions.SALES_RULES.REMOVE_RULE);

  return {
    refetch,
    rules,
    loading,
    error,
    handleOpenCreateRuleModal,
    handleOpenUpdateRuleModal,
    handleDeleteRuleClick,
    isCreateRuleAllow,
    isDeleteRuleAllow,
  };
};

export default useHierarchyProfileRules;
