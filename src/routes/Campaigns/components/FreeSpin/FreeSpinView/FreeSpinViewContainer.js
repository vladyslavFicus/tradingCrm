import { graphql, compose } from 'react-apollo';
import { freeSpinTemplatesQuery, freeSpinTemplateQuery } from '.././../../../../graphql/queries/campaigns';
import FreeSpinView from './FreeSpinView';

export default compose(
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
