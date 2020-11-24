import compose from 'compose-function';
import { graphql } from '@apollo/client/react/hoc';
import { withNotifications } from 'hoc';
import { addExistingOperator } from 'graphql/mutations/operators';
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
