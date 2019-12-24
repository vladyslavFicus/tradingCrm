import { withApollo, graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withModals } from 'components/HighOrder';
import { withStorage } from 'providers/StorageProvider';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { clientsQuery } from 'graphql/queries/profile';
import limitItems from 'utils/limitItems';
import MoveModal from '../components/Modals';
import List from '../components/List';

export default compose(
  withApollo,
  withModals({
    representativeModal: RepresentativeUpdateModal,
    moveModal: MoveModal,
    confirmationModal: ConfirmActionModal,
  }),
  withStorage(['auth']),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: () => ({
      fetchPolicy: 'cache-and-network',
    }),
  }),
  graphql(clientsQuery, {
    name: 'profiles',
    options: ({ location: { query } }) => {
      const filters = (query) ? query.filters : {};
      const { searchLimit } = filters;

      // The backend expected to get desks and teams like arrays of strings
      // but for now, redux form returns just strings for desks and teams
      // because selects didn't hava multivalues flag
      if (filters) {
        if (filters.desks && !Array.isArray(filters.desks)) {
          filters.desks = [filters.desks];
        }

        if (filters.teams && !Array.isArray(filters.teams)) {
          filters.teams = [filters.teams];
        }

        if (filters.firstTimeDeposit) {
          if (typeof filters.firstTimeDeposit === 'string') {
            filters.firstTimeDeposit = Boolean(parseInt(filters.firstTimeDeposit, 10));
          } else {
            filters.firstTimeDeposit = Boolean(filters.firstTimeDeposit);
          }
        }
      }

      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          args: {
            ...filters,
            page: {
              from: 0,
              size: searchLimit || 20,
            },
          },
        },
      };
    },
    props: ({ profiles: { profiles, fetchMore, ...rest }, ownProps: { location } }) => {
      const { response, currentPage } = limitItems(profiles, location);
      const filters = get(location, 'query.filters') || null;
      const searchLimit = get(filters, 'searchLimit') || 0;

      return {
        profiles: {
          ...rest,
          profiles: response,
          loadMore: () => (!searchLimit) && fetchMore({
            variables: {
              args: {
                ...filters,
                page: {
                  from: currentPage + 1,
                  size: 20,
                },
              },
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.profiles.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  profiles: {
                    ...previousResult.profiles,
                    ...fetchMoreResult.profiles,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                profiles: {
                  ...previousResult.profiles,
                  ...fetchMoreResult.profiles,
                  data: {
                    ...previousResult.profiles.data,
                    ...fetchMoreResult.profiles.data,
                    page: fetchMoreResult.profiles.data.page,
                    content: [
                      ...previousResult.profiles.data.content,
                      ...fetchMoreResult.profiles.data.content,
                    ],
                  },
                },
              };
            },
          }),
        },
      };
    },
  }),
)(List);
