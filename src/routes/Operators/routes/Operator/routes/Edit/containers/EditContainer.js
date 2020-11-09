import { compose, graphql } from 'react-apollo';
import { getUserHierarchyById } from 'graphql/queries/hierarchy';
import Edit from '../components/Edit';

export default compose(
  graphql(getUserHierarchyById, {
    name: 'userHierarchy',
    options: ({
      match: { params: { id } },
    }) => ({
      variables: { uuid: id },
      fetchPolicy: 'network-only',
    }),
  }),
)(Edit);
