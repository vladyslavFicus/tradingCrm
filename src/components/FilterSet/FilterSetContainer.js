import compose from 'compose-function';
import { graphql, withApollo } from '@apollo/client/react/hoc';
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
    props: ({ filterSet: { filterSets, error, loading, refetch, ...rest }, ownProps: { filterSetType } }) => {
      const favourite = get(filterSets, 'favourite') || [];
      const common = get(filterSets, 'common') || [];

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
