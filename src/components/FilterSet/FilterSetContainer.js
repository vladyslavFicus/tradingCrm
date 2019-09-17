import { graphql, compose, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { filterSetByUserIdQuery } from 'graphql/queries/filterSet';
import { updateFavourite, deleteFilterSet } from 'graphql/mutations/filterSet';
import { filterSetTypes } from 'constants/filterSet';
import { withModals, withNotifications } from 'components/HighOrder';
import ActionFilterModal from './ActionFilterModal';
import FilterSet from './FilterSet';

export default compose(
  withNotifications,
  withModals({
    actionFilterModal: ActionFilterModal,
  }),
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
  graphql(deleteFilterSet, {
    name: 'deleteFilter',
  }),
)(FilterSet);
