import { graphql, compose } from 'react-apollo';
import { wageringQuery } from '.././../../../../graphql/queries/campaigns';
import { getBrandId } from '../../../../../config';
import { currencyQuery } from '../../../../../graphql/queries/options';
import WageringView from './WageringView';

export default compose(
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: {
      variables: {
        brandId: getBrandId(),
      },
    },
  }),
  graphql(wageringQuery, {
    options: ({ uuid }) => ({
      variables: {
        uuid,
      },
    }),
    skip: ({ uuid, optionCurrencies: { loading } }) => !uuid || loading,
    name: 'wagering',
  }),
)(WageringView);
