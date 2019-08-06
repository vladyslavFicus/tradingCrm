import { connect } from 'react-redux';
import { withApollo, graphql, compose } from 'react-apollo';
import { withNotifications, withModals } from 'components/HighOrder';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { clientsBulkRepresentativeUpdate } from 'graphql/mutations/profile';
import { clientsQuery } from 'graphql/queries/profile';
import countries from 'utils/countryList';
import limitItems from 'utils/limitItems';
import { graphql as customGql } from 'graphql/utils';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import { actionCreators } from '../modules/list';
import { MoveModal } from '../components/Modals';
import List from '../components/List';

const mapStateToProps = ({
  usersList: list,
  i18n: { locale },
  options: { data: { currencyCodes } },
  auth: { brandId, uuid, department, role },
}) => ({
  list,
  locale,
  currencies: currencyCodes,
  countries,
  auth: { brandId, uuid, department, role },
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default compose(
  withApollo,
  withNotifications,
  withModals({
    representativeModal: RepresentativeUpdateModal,
    moveModal: MoveModal,
  }),
  connect(mapStateToProps, mapActions),
  graphql(clientsBulkRepresentativeUpdate, {
    name: 'bulkRepresentativeUpdate',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: ({
      auth: { uuid },
    }) => ({
      variables: { userId: uuid },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  customGql(clientsQuery, {
    name: 'profiles',
    options: ({ location: { query } }) => ({
      variables: {
        ...query && query.filters,
        page: 0,
        size: 20,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ profiles: { profiles, fetchMore, ...rest }, ownProps: { location } }) => {
      const { response, currentPage } = limitItems(profiles, location);

      return {
        profiles: {
          ...rest,
          profiles: response,
          loadMore: () => fetchMore({
            variables: { page: currentPage + 1 },
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
  })
)(List);
