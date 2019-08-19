import { graphql, compose } from 'react-apollo';
import { partnersQuery } from 'graphql/queries/partners';
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
)(RuleModal);
