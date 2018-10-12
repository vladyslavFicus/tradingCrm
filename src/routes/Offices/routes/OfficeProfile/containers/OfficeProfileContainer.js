import { graphql, compose } from 'react-apollo';
import OfficeProfile from '../components/OfficeProfile';
import { getBranchInfo } from '../../../../../graphql/queries/hierarchy';

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
