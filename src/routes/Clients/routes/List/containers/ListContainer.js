import { withApollo, graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withModals } from 'hoc';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import { clientsQuery } from 'graphql/queries/profile';
import limitItems from 'utils/limitItems';
import List from '../components/List';

const PROFILES_SIZE = 20;

export default compose(
  withApollo,
  withModals({ confirmationModal: ConfirmActionModal }),
  graphql(clientsQuery, {
    name: 'profiles',
    options: ({ location: { state } }) => {
      const filters = { ...state?.filters };
      const sorts = state?.sorts || [];
      const searchLimit = filters?.searchLimit || 0;

      if (filters) {
        if (filters.desks && !Array.isArray(filters.desks)) {
          filters.desks = [filters.desks];
        }

        if (filters.teams && !Array.isArray(filters.teams)) {
          filters.teams = [filters.teams];
        }

        if (filters.firstTimeDeposit) {
          filters.firstTimeDeposit = Boolean(+filters.firstTimeDeposit);
        }

        if (filters.isReferrered) {
          filters.isReferrered = Boolean(+filters.isReferrered);
        }
      }

      return {
        context: { batch: false },
        fetchPolicy: 'cache-and-network',
        variables: {
          args: {
            ...filters,
            page: {
              from: 0,
              size: searchLimit && searchLimit < PROFILES_SIZE ? searchLimit : PROFILES_SIZE,
              sorts,
            },
          },
        },
      };
    },
    props: ({ profiles: { variables: { args }, profiles, fetchMore, ...rest }, ownProps: { location } }) => {
      const { response, currentPage } = limitItems(profiles, location);
      const filters = location?.state?.filters || {};
      const sorts = location?.state?.sorts || [];
      const searchLimit = filters?.searchLimit || 0;

      if (filters.firstTimeDeposit) {
        filters.firstTimeDeposit = Boolean(+filters.firstTimeDeposit);
      }

      if (filters.isReferrered) {
        filters.isReferrered = Boolean(+filters.isReferrered);
      }

      const restLimitSize = searchLimit && (searchLimit - (currentPage + 1) * PROFILES_SIZE);

      const size = restLimitSize && (restLimitSize < PROFILES_SIZE)
        ? restLimitSize
        : PROFILES_SIZE;

      return {
        profiles: {
          ...rest,
          profiles: response,
          loadMore: () => fetchMore({
            variables: {
              args: {
                ...filters,
                ...args,
                page: {
                  from: currentPage + 1,
                  size,
                  sorts,
                },
              },
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              const error = get(fetchMoreResult, 'error');

              return {
                ...previousResult,
                ...fetchMoreResult,
                profiles: {
                  ...previousResult.profiles,
                  ...fetchMoreResult.profiles,
                  ...!error && {
                    page: fetchMoreResult.profiles.page,
                    content: [
                      ...previousResult.profiles.content,
                      ...fetchMoreResult.profiles.content,
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
