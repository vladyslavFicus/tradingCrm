import { graphql } from 'react-apollo';
import { freeSpinTemplatesQuery } from '.././../../../../graphql/queries/campaigns';
import FreeSpinView from './FreeSpinView';

export default graphql(freeSpinTemplatesQuery, {
  name: 'freeSpinTemplates',
})(FreeSpinView);
