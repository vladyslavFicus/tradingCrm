import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { get } from 'lodash';
import {
  freeSpinTemplatesQuery,
  freeSpinTemplateQuery,
} from '.././../../../../../../../../../../graphql/queries/campaigns';
import { currencyQuery } from '../../../../../../../../../../../graphql/queries/options';
import FreeSpinAssignModal from './FreeSpinAssignModal';
import FreeSpinCreateModal from '../FreeSpinCreateModal';
import { withModals, withReduxFormValues } from '../../../../../../../../../../../components/HighOrder';
import validator from './validator';
import { getBrandId } from '../../../../../../../../../../../config';
import { gameListQuery } from '../../../../../../../../../../../graphql/queries/games';

const FORM_NAME = 'assignFreeSpinModal';

export default compose(
  withModals({ createFreeSpin: FreeSpinCreateModal }),
  connect(({ auth: { brandId } }) => ({ brandId })),
  reduxForm({
    form: FORM_NAME,
    touchOnChange: true,
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
  graphql(gameListQuery, {
    name: 'games',
    skip: ({ freeSpinTemplate }) => {
      const { providerId, aggregatorId } = get(freeSpinTemplate, 'freeSpinTemplate.data', {});

      return !providerId || !aggregatorId;
    },
    options: ({ freeSpinTemplate }) => {
      const { providerId, aggregatorId } = get(freeSpinTemplate, 'freeSpinTemplate.data', {});

      return {
        variables: {
          page: 0,
          size: 9999,
          withLines: true,
          brandId: getBrandId(),
          gameProvider: providerId,
          aggregator: aggregatorId,
        },
      };
    },
  }),
)(FreeSpinAssignModal);
