import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { set, cloneDeep } from 'lodash';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { Button } from 'components/Buttons';
import Placeholder from 'components/Placeholder';
import CreateDistributionRuleModal from 'modals/CreateDistributionRuleModal';
import DistributionRulesGrid from './components/DistributionRulesGrid';
import DistributionRulesGridFilters from './components/DistributionRulesGridFilters';
import {
  useDistributionRulesQuery,
  DistributionRulesQueryVariables,
} from './graphql/__generated__/DistributionRulesQuery';
import './DistributionRuleList.scss';

type Props = {
  modals: {
    createDistributionRuleModal: Modal,
  },
};

const DistributionRuleList = (props: Props) => {
  const { modals: { createDistributionRuleModal } } = props;

  const { state } = useLocation<State<DistributionRulesQueryVariables>>();

  const permission = usePermission();

  const allowCreateRule = permission.allows(permissions.CLIENTS_DISTRIBUTION.CREATE_RULE);

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
  const handlePageChanged = () => {
    fetchMore({ variables: set(cloneDeep(variables as DistributionRulesQueryVariables), 'args.page', number + 1) });
  };

  const handleCreateRule = () => {
    createDistributionRuleModal.show();
  };

  return (
    <div className="DistributionRulesList">
      <div className="DistributionRulesList__header">
        <Placeholder ready={!loading} rows={[{ width: 220, height: 20 }]}>
          <span>
            <strong>{totalElements} </strong>

            {I18n.t('CLIENTS_DISTRIBUTION.TITLE')}
          </span>
        </Placeholder>

        <If condition={allowCreateRule}>
          <Button
            small
            tertiary
            onClick={handleCreateRule}
          >
            {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
          </Button>
        </If>
      </div>

      <DistributionRulesGridFilters onRefetch={refetch} />

      <DistributionRulesGrid
        content={content}
        loading={loading}
        last={last}
        onRefetch={refetch}
        onMore={handlePageChanged}
      />
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    createDistributionRuleModal: CreateDistributionRuleModal,
  }),
)(DistributionRuleList);
