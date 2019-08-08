import { graphql, compose } from 'react-apollo';
import { getRules } from 'graphql/queries/rules';
import { deleteRule } from 'graphql/mutations/rules';
import withModals from 'components/HighOrder/withModals';
import withNotifications from 'components/HighOrder/withNotifications';
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
