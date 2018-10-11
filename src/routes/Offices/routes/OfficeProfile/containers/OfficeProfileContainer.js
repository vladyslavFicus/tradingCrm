import { graphql, compose } from 'react-apollo';
import OfficeProfile from '../components/OfficeProfile';
import { withNotifications } from '../../../../../components/HighOrder';
import { getBranchInfo } from '../../../../../graphql/queries/hierarchy';

export default compose(
  withNotifications,
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
