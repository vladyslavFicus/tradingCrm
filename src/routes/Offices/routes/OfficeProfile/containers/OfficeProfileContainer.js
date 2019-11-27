import { graphql, compose } from 'react-apollo';
import { getBranchInfo } from 'graphql/queries/hierarchy';
import OfficeProfile from '../components/OfficeProfile';

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
    name: 'officeProfile',
  }),
)(OfficeProfile);
