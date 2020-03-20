import { graphql, compose } from 'react-apollo';
import { withModals, withNotifications } from 'hoc';
import { getRules } from 'graphql/queries/rules';
import { deleteRule } from 'graphql/mutations/rules';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import SalesRules from './SalesRules';

export default compose(
  withNotifications,
  withModals({
    deleteModal: ConfirmActionModal,
  }),
  graphql(deleteRule, {
    name: 'deleteRule',
  }),
  graphql(getRules, {
    options: ({ location: { query } }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        ...query && query.filters,
      },
    }),
    name: 'rules',
  }),
)(SalesRules);
