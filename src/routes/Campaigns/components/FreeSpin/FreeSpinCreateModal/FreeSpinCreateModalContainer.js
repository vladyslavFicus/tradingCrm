import { compose, graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';
import { getBrandId } from '../../../../../config';
import { currencyQuery } from '../../../../../graphql/queries/options';
import { freeSpinTemplateOptionsQuery } from '../../../../../graphql/queries/campaigns';
import FreeSpinCreateModal from './FreeSpinCreateModal';

const FORM_NAME = 'addFreeSpinTemplate';

export default compose(
  reduxForm({
    form: FORM_NAME,
  }),
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: {
      variables: {
        brandId: getBrandId(),
      },
    },
  }),
  graphql(freeSpinTemplateOptionsQuery, {
    name: 'freeSpinOptions',
  }),
)(FreeSpinCreateModal);
