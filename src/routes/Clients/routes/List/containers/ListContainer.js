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
    options: ({ location: { query } }) => {
      const filters = (query) ? query.filters : [];
      const sorts = (query) ? query.sorts : [];
      const searchLimit = get(filters, 'searchLimit') || 0;

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
      }

      return {
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
    props: ({ profiles: { profiles, fetchMore, ...rest }, ownProps: { location } }) => {
      const { response, currentPage } = limitItems(profiles, location);
      const filters = get(location, 'query.filters') || [];
      const sorts = get(location, 'query.sorts') || [];
      const searchLimit = get(filters, 'searchLimit') || 0;

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

              const error = get(fetchMoreResult, 'profiles.error');

              return {
                ...previousResult,
                ...fetchMoreResult,
                profiles: {
                  ...previousResult.profiles,
                  ...fetchMoreResult.profiles,
                  ...!error && {
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
                },
              };
            },
          }),
        },
      };
    },
  }),
)(List);
