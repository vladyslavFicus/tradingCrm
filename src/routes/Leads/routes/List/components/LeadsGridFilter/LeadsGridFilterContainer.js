import { connect } from 'react-redux';
import { graphql, compose, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { withNotifications } from 'hoc';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import countries from 'utils/countryList';
import { operatorsQuery } from 'graphql/queries/operators';
import LeadsGridFilter from './LeadsGridFilter';

export default compose(
  withApollo,
  withNotifications,
  connect(({ auth: { uuid } }) => ({ countries, auth: { uuid } })),
  graphql(operatorsQuery, {
    name: 'operators',
    props: ({ operators: { operators, loading: operatorsLoading } }) => ({
      operators: get(operators, 'data.content') || [],
      operatorsLoading,
    }),
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: ({
      auth: { uuid },
    }) => ({
      variables: { userId: uuid },
      fetchPolicy: 'network-only',
    }),
    props: ({ userBranchHierarchy: { hierarchy, loading: branchesLoading } }) => ({
      teams: get(hierarchy, 'userBranchHierarchy.data.TEAM') || [],
      desks: get(hierarchy, 'userBranchHierarchy.data.DESK') || [],
      branchesLoading,
    }),
  }),
)(LeadsGridFilter);
