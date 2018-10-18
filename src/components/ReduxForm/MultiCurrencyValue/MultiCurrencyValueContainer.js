import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { currencyQuery } from '../../../graphql/queries/options';
import MultiCurrencyValue from './MultiCurrencyValue';
import { withMultiCurrencyModal, withReduxFormValues } from '../../HighOrder';

export default compose(
  withReduxFormValues,
  connect(({ auth: { brandId } }) => ({ brandId }),
    (dispatch, { formName }) => ({
      change: (field, value) => dispatch(change(formName, field, value)),
    })),
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: ({ brandId }) => ({
      variables: {
        brandId,
      },
    }),
    skip: ({ brandId }) => !brandId,
  }),
  withMultiCurrencyModal,
)(MultiCurrencyValue);
