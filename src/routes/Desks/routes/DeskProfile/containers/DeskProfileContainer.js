import compose from 'compose-function';
import { graphql } from '@apollo/client/react/hoc';
import { getBranchInfo } from '../../../../../graphql/queries/hierarchy';
import DeskProfile from '../components/DeskProfile';

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
    name: 'deskProfile',
  }),
)(DeskProfile);
