import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import {
  freeSpinTemplatesQuery, freeSpinTemplateQuery,
} from '.././../../../../../../../../../../graphql/queries/campaigns';
import { currencyQuery } from '../../../../../../../../../../../graphql/queries/options';
import FreeSpinAssignModal from './FreeSpinAssignModal';
import FreeSpinCreateModal from '../FreeSpinCreateModal';
import { withModals, withReduxFormValues } from '../../../../../../../../../../../components/HighOrder';
import validator from './validator';

const FORM_NAME = 'assignFreeSpinModal';

export default compose(
  withModals({ createFreeSpin: FreeSpinCreateModal }),
  connect(({ auth: { brandId } }) => ({ brandId })),
  reduxForm({
    form: FORM_NAME,
    validate: validator,
  }),
  withReduxFormValues,
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: ({ brandId }) => ({
      variables: {
        brandId,
      },
    }),
    skip: ({ brandId }) => !brandId,
  }),
  graphql(freeSpinTemplatesQuery, {
    name: 'freeSpinTemplates',
  }),
  graphql(freeSpinTemplateQuery, {
    options: ({ formValues: { uuid }, freeSpinTemplates: { freeSpinTemplates } }) => ({
      variables: {
        uuid,
        aggregatorId: freeSpinTemplates.find(({ uuid: id }) => id === uuid).aggregatorId,
      },
    }),
    skip: ({ formValues, freeSpinTemplates: { loading, freeSpinTemplates } }) => (
      !formValues || !formValues.uuid || loading || !freeSpinTemplates.find(({ uuid: id }) => id === formValues.uuid)
    ),
    name: 'freeSpinTemplate',
  }),
)(FreeSpinAssignModal);
