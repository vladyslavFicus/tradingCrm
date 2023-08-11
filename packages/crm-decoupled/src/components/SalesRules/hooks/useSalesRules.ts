import { useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { Config, useModal, notify, usePermission, Types } from '@crm/common';
import { Operator, Partner, Rule } from '__generated__/types';
import { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import ConfirmActionModal from 'modals/ConfirmActionModal/ConfirmActionModal';
import { CreateRuleModalProps } from 'modals/CreateRuleModal';
import CreateRuleModal from 'modals/CreateRuleModal/CreateRuleModal';
import { UpdateRuleModalProps } from 'modals/UpdateRuleModal';
import UpdateRuleModal from 'modals/UpdateRuleModal/UpdateRuleModal';
import { OPERATORS_SORT } from '../constants';
import { useDeleteRule } from '../graphql/__generated__/DeleteRuleMutation';
import { RulesQueryVariables, useRulesQuery } from '../graphql/__generated__/RulesQuery';
import { OperatorsQueryVariables, useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';
import { usePartnersQuery } from '../graphql/__generated__/PartnersQuery';

export type RuleInfo = {
  fieldName: string,
  translateMultiple: string,
  translateSingle: string,
  withUpperCase?: boolean,
};

type Props = {
  type?: string,
};

const useSalesRules = (props: Props) => {
  const { type: userType } = props;
  const parentBranch = useParams().id as string;

  const state = useLocation().state as Types.State;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const createRuleModal = useModal<CreateRuleModalProps>(CreateRuleModal);
  const updateRuleModal = useModal<UpdateRuleModalProps>(UpdateRuleModal);

  // ===== Requests ===== //
  const [deleteRule] = useDeleteRule();

  const rulesQuery = useRulesQuery({
    variables: {
      ...state?.filters as RulesQueryVariables,
      ...(userType === 'PARTNER' && { affiliateId: parentBranch || '' }),
      ...(userType === 'OPERATOR' && { operatorUuids: parentBranch || '' }),
    },
    fetchPolicy: 'cache-and-network',
  });
  const { data, refetch, loading } = rulesQuery;
  const rules = data?.rules || [];

  const operatorsQuery = useOperatorsQuery({
    variables: {
      ...state?.filters as OperatorsQueryVariables,
      page: {
        from: 0,
        size: 1000,
        sorts: OPERATORS_SORT,
      },
    },
  });

  const partnersQuery = usePartnersQuery();

  // ===== Handlers ===== //
  const handleOpenCreateRuleModal = useCallback(() => {
    createRuleModal.show({
      parentBranch,
      userType,
      withOperatorSpreads: true,
      onSuccess: async () => {
        await refetch();
        createRuleModal.hide();
      },
    });
  }, [parentBranch, userType]);

  const handleOpenUpdateRuleModal = useCallback(({ uuid }: Rule) => {
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
      await deleteRule({ variables: { uuid } });

      await refetch();

      confirmActionModal.hide();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED'),
      });
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    }
  }, []);

  const handleDeleteRuleClick = useCallback(({ uuid }: Rule) => {
    const result = rules.find(rule => rule?.uuid === uuid);
    const name = result?.name;

    confirmActionModal.show({
      onSubmit: handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t(
        'HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT',
        { name },
      ),
      submitButtonLabel: I18n.t(
        'HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE',
      ),
    });
  }, [rules]);

  const operators = (operatorsQuery.data?.operators?.content as Operator[]) || [];
  const partners = (partnersQuery.data?.partners?.content as Partner[]) || [];

  const permission = usePermission();
  const allowDeleteSalesRule = permission.allows(
    Config.permissions.SALES_RULES.REMOVE_RULE,
  );
  const allowCreateSalesRule = permission.allows(Config.permissions.SALES_RULES.CREATE_RULE);


  return {
    rules,
    loading,
    refetch,
    handleOpenCreateRuleModal,
    handleOpenUpdateRuleModal,
    handleDeleteRuleClick,
    operators,
    partners,
    allowDeleteSalesRule,
    allowCreateSalesRule,
  };
};

export default useSalesRules;
