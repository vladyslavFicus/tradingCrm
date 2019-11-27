import { compose, graphql } from 'react-apollo';
import { clientsQuery } from 'graphql/queries/profile';
import ClientsGrid from './ClientsGrid';

export default compose(
  graphql(clientsQuery, {
    name: 'profiles',
    options: variables => ({ variables }),
  }),
)(ClientsGrid);
