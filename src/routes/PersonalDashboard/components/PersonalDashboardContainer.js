import { compose, graphql } from 'react-apollo';
import { getMetabaseTokenQuery } from 'graphql/queries/metabase';
import { withStorage } from 'providers/StorageProvider';
import PersonalDashboard from './PersonalDashboard';

export default compose(
  withStorage(['auth']),
  graphql(getMetabaseTokenQuery, {
    options: ({ auth: { uuid } }) => ({
      variables: { agent_id: uuid },
    }),
    name: 'metabaseToken',
  }),
)(PersonalDashboard);
