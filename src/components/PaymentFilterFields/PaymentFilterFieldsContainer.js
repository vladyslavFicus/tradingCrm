import { get } from 'lodash';
import { compose, graphql, withApollo } from 'react-apollo';
import { operatorsQuery } from 'graphql/queries/operators';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import PaymentFilterFields from './PaymentFilterFields';

export default compose(
  withApollo,
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
    props: ({ userBranchHierarchy: { hierarchy, loading } }) => ({
      teams: get(hierarchy, 'userBranchHierarchy.data.TEAM') || [],
      desks: get(hierarchy, 'userBranchHierarchy.data.DESK') || [],
      disabledBranches: get(hierarchy, 'error') || loading,
    }),
  }),
  graphql(operatorsQuery, {
    name: 'operators',
    props: ({ operators: { operators, loading } }) => ({
      originalAgents: get(operators, 'data.content', []),
      disabledOriginalAgents: get(operators, 'error') || loading,
    }),
  }),
)(PaymentFilterFields);
