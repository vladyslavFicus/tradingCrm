import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { currencyQuery } from '../../../graphql/queries/options';
import MultiCurrencyValue from './MultiCurrencyValue';
import { withMultiCurrencyModal, withReduxFormValues } from '../../HighOrder';

export default compose(
  connect(({ auth: { brandId } }) => ({ brandId })),
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: ({ brandId }) => ({
      variables: {
        brandId,
      },
    }),
    skip: ({ brandId }) => !brandId,
  }),
  withReduxFormValues,
  withMultiCurrencyModal,
)(MultiCurrencyValue);
