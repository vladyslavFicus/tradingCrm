import { compose, graphql, withApollo } from 'react-apollo';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import { getBrandId } from '../../../../../../../../../../../config';
import { currencyQuery } from '../../../../../../../../../../../graphql/queries/options';
import {
  freeSpinTemplateOptionsQuery,
  freeSpinTemplatesQuery,
} from '../../../../../../../../../../../graphql/queries/campaigns';
import { freeSpinTemplateMutation } from '../../../../../../../../../../../graphql/mutations/campaigns';
import { gameListQuery } from '../../../../../../../../../../../graphql/queries/games';
import FreeSpinCreateModal from './FreeSpinCreateModal';
import { withNotifications } from '../../../../../../../../../../../components/HighOrder';
import validator from './validator';

const FORM_NAME = 'manualFreeSpinModal';

export default compose(
  withApollo,
  withNotifications,
  connect((state) => {
    const {
      aggregatorId,
      providerId,
      gameId,
      bonusTemplateUUID,
      ...currentValues
    } = getFormValues(FORM_NAME)(state) || {};

    return {
      aggregatorId,
      providerId,
      bonusTemplateUUID,
      gameId,
      currentValues,
    };
  }),
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: {
      fetchPolicy: 'network-only',
      variables: {
        brandId: getBrandId(),
      },
    },
  }),
  graphql(gameListQuery, {
    name: 'games',
    skip: ({ aggregatorId, providerId }) => !providerId || !aggregatorId,
    options: ({ providerId, aggregatorId }) => ({
      variables: {
        page: 0,
        size: 9999,
        brandId: getBrandId(),
        gameProvider: providerId,
        aggregator: aggregatorId,
      },
    }),
  }),
  graphql(freeSpinTemplateOptionsQuery, {
    name: 'freeSpinOptions',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(freeSpinTemplateMutation, {
    name: 'addFreeSpinTemplate',
    options: {
      update: (proxy, { data: { freeSpinTemplate: { add: { error, data } } } }) => {
        if (error) {
          return;
        }

        const { freeSpinTemplates } = proxy.readQuery({ query: freeSpinTemplatesQuery });
        const updatedFreeSpinTemplates = update(freeSpinTemplates, {
          $push: [data],
        });

        proxy.writeQuery({
          query: freeSpinTemplatesQuery,
          data: {
            freeSpinTemplates: updatedFreeSpinTemplates,
          },
        });
      },
    },
  }),
  reduxForm({
    form: FORM_NAME,
    shouldError: ({ props }) => !props.touched,
    validate: validator,
  }),
)(FreeSpinCreateModal);
