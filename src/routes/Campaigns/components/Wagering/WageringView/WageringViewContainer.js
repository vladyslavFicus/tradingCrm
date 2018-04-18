import { graphql, compose } from 'react-apollo';
import { wageringQuery } from '.././../../../../graphql/queries/campaigns';
import WageringView from './WageringView';
import { withReduxFormValues } from '../../../../../components/HighOrder';

export default compose(
  withReduxFormValues,
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
