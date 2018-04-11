import { graphql, compose } from 'react-apollo';
import { freeSpinTemplatesQuery, freeSpinTemplateQuery } from '.././../../../../graphql/queries/campaigns';
import FreeSpinView from './FreeSpinView';
import FreeSpinCreateModal from '../FreeSpinCreateModal';
import { withModals } from '../../../../../components/HighOrder';

export default compose(
  withModals({ createFreeSpin: FreeSpinCreateModal }),
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
    skip: ({ uuid, freeSpinTemplates: { loading } }) => !uuid || loading,
    name: 'freeSpinTemplate',
  }),
)(FreeSpinView);
