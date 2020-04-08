import { graphql, compose } from 'react-apollo';
import { partnersQuery } from 'graphql/queries/partners';
import { operatorsQuery } from 'graphql/queries/operators';
import RuleModal from './RuleModal';

export default compose(
  graphql(partnersQuery, {
    name: 'partners',
    options: () => ({
      variables: {
        size: 5000,
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(operatorsQuery, {
    name: 'operators',
  }),
)(RuleModal);
