import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withNotifications, withModals } from 'hoc';
import { deleteFilterSet } from 'graphql/mutations/filterSet';
import { filterSetByUserIdQuery } from 'graphql/queries/filterSet';
import ActionFilterModal from 'modals/ActionFilterModal';
import ConfirmActionModal from '../Modal/ConfirmActionModal';
import FilterSetButtons from './FilterSetButtons';

export default compose(
  withNotifications,
  withModals({
    actionFilterModal: ActionFilterModal,
    confirmActionModal: ConfirmActionModal,
  }),
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
  graphql(deleteFilterSet, {
    name: 'deleteFilter',
  }),
)(FilterSetButtons);
