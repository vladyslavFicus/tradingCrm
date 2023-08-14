import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { set, cloneDeep } from 'lodash';
import { Config, usePermission, useModal, Types } from '@crm/common';
import CreateDistributionRuleModal, { CreateDistributionRuleModalProps } from 'modals/CreateDistributionRuleModal';
import {
  useDistributionRulesQuery,
  DistributionRulesQuery,
  DistributionRulesQueryVariables,
} from '../graphql/__generated__/DistributionRulesQuery';

type DistributionRules = ExtractApolloTypeFromArray<DistributionRulesQuery['distributionRules']['content']>;

type UseDistributionRuleList = {
  allowCreateRule: boolean,
  content: Array<DistributionRules>,
  last: boolean,
  totalElements: number,
  loading: boolean,
  refetch: () => void,
  handlePageChanged: () => void,
  handleCreateRule: () => void,
};

const useDistributionRuleList = (): UseDistributionRuleList => {
  const createDistributionRuleModal = useModal<CreateDistributionRuleModalProps>(CreateDistributionRuleModal);

  const state = useLocation().state as Types.State<DistributionRulesQueryVariables>;

  const permission = usePermission();

  const allowCreateRule = permission.allows(Config.permissions.CLIENTS_DISTRIBUTION.CREATE_RULE);

  // ===== Requests ===== //
  const { data, loading, variables, fetchMore, refetch } = useDistributionRulesQuery({
    variables: {
      args: {
        ...state?.filters as DistributionRulesQueryVariables,
        page: 0,
        size: 10,
      },
    },
    context: { batch: false },
  });

  const { content = [], last = false, totalElements = 0, number = 0 } = data?.distributionRules || {};

  // ===== Handlers ===== //
  const handlePageChanged = useCallback(() => {
    if (!loading) {
      fetchMore({ variables: set(cloneDeep(variables as DistributionRulesQueryVariables), 'args.page', number + 1) });
    }
  }, [loading, number, variables]);

  const handleCreateRule = useCallback(() => {
    createDistributionRuleModal.show();
  }, []);

  return {
    allowCreateRule,
    content,
    last,
    totalElements,
    loading,
    refetch,
    handlePageChanged,
    handleCreateRule,
  };
};

export default useDistributionRuleList;
