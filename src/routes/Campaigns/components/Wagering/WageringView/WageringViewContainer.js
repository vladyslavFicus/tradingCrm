import { graphql } from 'react-apollo';
import { wageringQuery } from '.././../../../../graphql/queries/campaigns';
import WageringView from './WageringView';

export default graphql(wageringQuery, {
  options: ({ uuid }) => ({
    variables: {
      uuid,
    },
  }),
  skip: ({ uuid }) => !uuid,
  name: 'wagering',
})(WageringView);
