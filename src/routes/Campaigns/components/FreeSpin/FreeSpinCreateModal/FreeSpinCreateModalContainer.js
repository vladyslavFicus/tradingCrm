import { compose, graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';
import { currencyQuery } from '../../../../../graphql/queries/options';

import FreeSpinCreateModal from './FreeSpinCreateModal';

export default compose(
  reduxForm({
    form: 'addFreeSpinTemplate',
  }),
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: {
      variables: {
        brandId: window.app.brandId,
      },
    },
  }),
)(FreeSpinCreateModal);
