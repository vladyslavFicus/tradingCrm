import { graphql, compose } from 'react-apollo';
import { wageringQuery } from '.././../../../../graphql/queries/campaigns';
import WageringView from './WageringView';

export default compose(
  graphql(wageringQuery, {
    options: ({ uuid }) => ({
      variables: {
        uuid,
      },
    }),
    skip: ({ uuid }) => !uuid,
    name: 'wagering',
  }),
)(WageringView);
