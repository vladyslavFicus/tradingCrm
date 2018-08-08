import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { freeSpinTemplatesQuery, freeSpinTemplateQuery } from '../../../../../../graphql/queries/campaigns';
import { currencyQuery } from '../../../../../../graphql/queries/options';
import FreeSpinView from './FreeSpinView';
import FreeSpinCreateModal from '../FreeSpinCreateModal';
import { withModals, withReduxFormValues } from '../../../../../../components/HighOrder';

export default compose(
  withModals({ createFreeSpin: FreeSpinCreateModal }),
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
  graphql(freeSpinTemplatesQuery, {
    name: 'freeSpinTemplates',
  }),
  graphql(freeSpinTemplateQuery, {
    options: ({ uuid, freeSpinTemplates: { freeSpinTemplates } }) => ({
      variables: {
        uuid,
        aggregatorId: freeSpinTemplates.find(({ uuid: id }) => id === uuid).aggregatorId,
      },
    }),
    skip: ({ uuid, freeSpinTemplates: { loading, freeSpinTemplates } }) => (
      !uuid || loading || !freeSpinTemplates.find(({ uuid: id }) => id === uuid)
    ),
    name: 'freeSpinTemplate',
  }),
  withReduxFormValues
)(FreeSpinView);
