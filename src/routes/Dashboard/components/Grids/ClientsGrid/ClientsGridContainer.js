import { compose, graphql } from 'react-apollo';
import { clientsQuery } from 'graphql/queries/profile';
import ClientsGrid from './ClientsGrid';

export default compose(
  graphql(clientsQuery, {
    name: 'profiles',
    options: () => ({
      variables: {
        args: {
          page: {
            from: 0,
            size: 10,
          },
        },
      },
    }),
  }),
)(ClientsGrid);
