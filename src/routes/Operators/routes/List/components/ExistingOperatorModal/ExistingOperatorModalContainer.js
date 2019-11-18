import { compose, graphql } from 'react-apollo';
import { addExistingOperator } from 'graphql/mutations/operators';
import { withNotifications } from 'components/HighOrder';
import ExistingOperatorModal from './ExistingOperatorModal';

export default compose(
  withNotifications,
  graphql(addExistingOperator, {
    name: 'addExistingOperator',
    options: ({ email, department, role, brandId }) => ({
      variables: {
        email,
        department,
        role,
        brandId,
      },
    }),
  }),
)(ExistingOperatorModal);
