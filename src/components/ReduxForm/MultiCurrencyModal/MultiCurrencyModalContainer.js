import { compose, graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { withReduxFormValues } from 'hoc';
import { createValidator } from '../../../utils/validator';
import { currencyQuery } from '../../../graphql/queries/options';
import MultiCurrencyModal from './MultiCurrencyModal';

const FORM_NAME = 'multiCurrencyModal';

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
  reduxForm({
    enableReinitialize: true,
    form: FORM_NAME,
    validate: (values, {
      optionCurrencies,
    }) => {
      const rules = {};
      const currencies = get(optionCurrencies, 'options.signUp.post.currency.list', []);

      for (let i = 0; i < currencies.length; i += 1) {
        rules[`amounts[${i}].amount`] = ['required', 'numeric', 'greater:0'];
      }

      return createValidator(rules, false)(values);
    },
  }),
  withReduxFormValues,
)(MultiCurrencyModal);
