import { graphql, compose, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { withNotifications } from 'hoc';
import { filterSetByUserIdQuery } from 'graphql/queries/filterSet';
import { updateFavourite } from 'graphql/mutations/filterSet';
import { filterSetTypes } from 'constants/filterSet';
import FilterSet from './FilterSet';

export default compose(
  withNotifications,
  withApollo,
  graphql(filterSetByUserIdQuery, {
    name: 'filterSet',
    options: ({ type }) => ({
      variables: { type },
      fetchPolicy: 'network-only',
    }),
    props: ({ filterSet: { filterSets, loading, refetch, ...rest } }) => {
      const favourite = get(filterSets, 'data.favourite') || [];
      const common = get(filterSets, 'data.common') || [];
      const error = get(filterSets, 'error');

      return {
        favourite,
        common,
        errorLoading: error,
        filtersLoading: loading,
        filtersRefetch: () => refetch({ type: filterSetTypes.CLIENT }),
        filterSet: {
          ...rest,
        },
      };
    },
  }),
  graphql(updateFavourite, {
    name: 'updateFavourite',
  }),
)(FilterSet);
