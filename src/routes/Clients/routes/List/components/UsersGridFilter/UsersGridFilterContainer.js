import { graphql, compose, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { withStorage } from 'providers/StorageProvider';
import { withNotifications } from 'components/HighOrder';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { operatorsQuery } from 'graphql/queries/operators';
import UsersGridFilter from './UsersGridFilter';

export default compose(
  withApollo,
  withNotifications,
  withStorage(['auth']),
  graphql(operatorsQuery, {
    name: 'operators',
    options: () => ({
      variables: {
        size: 2000,
      },
    }),
    props: ({ operators: { operators, loading: operatorsLoading } }) => ({
      operators: get(operators, 'data.content') || [],
      operatorsLoading,
    }),
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: ({
      auth: { uuid },
    }) => ({
      variables: { userId: uuid },
      fetchPolicy: 'network-only',
    }),
    props: ({ userBranchHierarchy: { hierarchy, loading: branchesLoading } }) => ({
      teams: get(hierarchy, 'userBranchHierarchy.data.TEAM') || [],
      desks: get(hierarchy, 'userBranchHierarchy.data.DESK') || [],
      branchesLoading,
    }),
  }),
)(UsersGridFilter);
