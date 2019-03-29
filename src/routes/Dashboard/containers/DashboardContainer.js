// import Dashboard from '../components/Dashboard';

// export default Dashboard;

import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { getMetabaseTokenQuery } from 'graphql/queries/metabase';
import NewDashboard from '../components/Dashboard';

const mapStateToProps = ({ auth: { uuid } }) => ({ agent_id: uuid });

export default compose(
  connect(mapStateToProps),
  graphql(getMetabaseTokenQuery, {
    options: ({ agent_id }) => ({ /* eslint-disable-line */
      variables: { agent_id },
    }),
    name: 'metabaseToken',
  })
)(NewDashboard);
