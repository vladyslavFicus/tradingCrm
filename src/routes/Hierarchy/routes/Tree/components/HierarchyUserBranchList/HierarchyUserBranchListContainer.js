import { graphql } from 'react-apollo';
import { getUserHierarchy } from 'graphql/queries/hierarchy';
import HierarchyUserBranchList from './HierarchyUserBranchList';

export default graphql(getUserHierarchy, {
  name: 'userHierarchy',
  options: {
    fetchPolicy: 'network-only',
  },
})(HierarchyUserBranchList);
