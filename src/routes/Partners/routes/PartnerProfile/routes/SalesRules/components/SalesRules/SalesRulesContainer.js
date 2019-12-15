import { graphql, compose } from 'react-apollo';
import { getRules } from 'graphql/queries/rules';
import { createRule, deleteRule } from 'graphql/mutations/rules';
import withModals from 'components/HighOrder/withModals';
import withNotifications from 'components/HighOrder/withNotifications';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import RuleModal from 'components/HierarchyProfileRules/components/RuleModal';
import SalesRules from './SalesRules';

export default compose(
  withNotifications,
  withModals({
    deleteModal: ConfirmActionModal,
    ruleModal: RuleModal,
  }),
  graphql(createRule, {
    name: 'createRule',
  }),
  graphql(deleteRule, {
    name: 'deleteRule',
  }),
  graphql(getRules, {
    options: ({
      match: {
        params: {
          id: parentId,
        },
      },
      location: { query },
    }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        ...query && query.filters,
        parentId,
      },
    }),
    name: 'rules',
  }),
)(SalesRules);