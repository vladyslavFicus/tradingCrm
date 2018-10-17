import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import countries from '../../../../../utils/countryList';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import { withNotifications, withModals } from '../../../../../components/HighOrder';
import { getHierarchyUsersByType, getUserBranchHierarchy } from '../../../../../graphql/queries/hierarchy';
import { clientsBulkRepresentativeUpdate } from '../../../../../graphql/mutations/profile';
import { clientsQuery } from '../../../../../graphql/queries/profile';
import { departments } from '../../../../../constants/brands';
import { userTypes } from '../../../../../constants/hierarchyTypes';
import { actionCreators } from '../modules/list';
import { RepresentativeModal } from '../components/Modals';
import List from '../components/List';

const mapStateToProps = ({
  usersList: list,
  i18n: { locale },
  options: { data: { currencyCodes } },
  auth: { brandId, uuid, hierarchyUsers, department },
}) => ({
  list,
  locale,
  currencies: currencyCodes,
  countries,
  auth: {
    brandId,
    uuid,
    hierarchyUsers,
    isAdministration: department === departments.ADMINISTRATION,
  },
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default compose(
  withNotifications,
  withModals({
    representativeModal: RepresentativeModal,
  }),
  connect(mapStateToProps, mapActions),
  graphql(clientsBulkRepresentativeUpdate, {
    name: 'bulkRepresentativeUpdate',
  }),
  graphql(getHierarchyUsersByType, {
    name: 'agents',
    options: {
      variables: { userTypes: [userTypes.SALES_AGENT, userTypes.RETENTION_AGENT] },
      fetchPolicy: 'network-only',
    },
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: ({
      auth: { uuid },
    }) => ({
      variables: { userId: uuid },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(clientsQuery, {
    name: 'profiles',
    skip: ({ auth }) => !(auth.isAdministration || get(auth, 'hierarchyUsers.clients')),
    options: ({
      location: { query },
      auth,
    }) => ({
      variables: {
        ...query ? query.filters : { registrationDateFrom: moment().startOf('day').utc().format() },
        page: 1,
        size: 20,
        ...!auth.isAdministration && { hierarchyUsers: get(auth, 'hierarchyUsers.clients') },
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ profiles: { profiles, fetchMore, ...rest } }) => {
      const newPage = get(profiles, 'data.page') || 1;

      return {
        profiles: {
          ...rest,
          profiles,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
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
