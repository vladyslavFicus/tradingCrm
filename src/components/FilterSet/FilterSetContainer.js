import { graphql, compose, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { withNotifications } from 'hoc';
import { filterSetByUserIdQuery } from 'graphql/queries/filterSet';
import { updateFavourite } from 'graphql/mutations/filterSet';
import FilterSet from './FilterSet';

export default compose(
  withNotifications,
  withApollo,
  graphql(filterSetByUserIdQuery, {
    name: 'filterSet',
    options: ({ filterSetType }) => ({
      variables: { type: filterSetType },
      fetchPolicy: 'network-only',
    }),
    props: ({ filterSet: { filterSets, loading, refetch, ...rest }, ownProps: { filterSetType } }) => {
      const favourite = get(filterSets, 'data.favourite') || [];
      const common = get(filterSets, 'data.common') || [];
      const error = get(filterSets, 'error');

      return {
        favourite,
        common,
        errorLoading: error,
        filtersLoading: loading,
        filtersRefetch: () => refetch({ type: filterSetType }),
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
