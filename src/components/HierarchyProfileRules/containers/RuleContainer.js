import { graphql, compose } from 'react-apollo';
import { withNotifications, withModals } from 'hoc';
import { getBranchChildren, getBranchInfo } from 'graphql/queries/hierarchy';
import { getRules, getRulesRetention } from 'graphql/queries/rules';
import { createRule, createRuleRetention, deleteRule, deleteRuleRetention } from 'graphql/mutations/rules';
import { deskTypes } from 'constants/rules';
import { branchTypes } from 'constants/hierarchyTypes';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import RuleModal from '../components/RuleModal';

export default (Component, type, branchType) => compose(
  withNotifications,
  withModals({
    ruleModal: RuleModal,
    deleteModal: ConfirmActionModal,
  }),
  graphql(createRule, {
    name: 'createRule',
  }),
  graphql(createRuleRetention, {
    name: 'createRuleRetention',
  }),
  graphql(deleteRule, {
    name: 'deleteRule',
  }),
  graphql(deleteRuleRetention, {
    name: 'deleteRuleRetention',
  }),
  graphql(getBranchInfo, {
    options: ({
      match: {
        params: {
          id: branchId,
        },
      },
    }) => ({
      variables: {
        branchId,
      },
    }),
    skip: branchType !== branchTypes.TEAM,
    name: 'getBranchInfo',
  }),
  graphql(getBranchChildren, {
    name: 'getBranchChildren',
    options: ({
      match: {
        params: {
          id: parentId,
        },
      },
    }) => ({
      variables: {
        uuid: parentId,
      },
    }),
    skip: branchType !== branchTypes.DESK,
  }),
  type === deskTypes.RETENTION
    ? graphql(getRulesRetention, {
      options: ({
        match: {
          params: {
            id: branchUuid,
          },
        },
        location: { query },
      }) => ({
        variables: {
          ...query && query.filters,
          branchUuid,
        },
      }),
      name: 'rules',
    })
    : graphql(getRules, {
      options: ({
        match: {
          params: {
            id: branchUuid,
          },
        },
        location: { query },
      }) => ({
        variables: {
          ...query && query.filters,
          branchUuid,
        },
      }),
      name: 'rules',
    }),
)(Component);
