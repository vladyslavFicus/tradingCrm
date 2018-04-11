import { compose, graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';
import { getBrandId } from '../../../../../config';
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
        brandId: getBrandId(),
      },
    },
  }),
)(FreeSpinCreateModal);
