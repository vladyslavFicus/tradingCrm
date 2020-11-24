import compose from 'compose-function';
import { graphql } from '@apollo/client/react/hoc';
import { getBranchInfo } from 'graphql/queries/hierarchy';
import TeamProfile from '../components/TeamProfile';

export default compose(
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
    name: 'teamProfile',
  }),
)(TeamProfile);
