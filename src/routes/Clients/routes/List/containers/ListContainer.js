import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import countries from '../../../../../utils/countryList';
import { profilesQuery } from '../../../../../graphql/queries/profile';
import { departments } from '../../../../../constants/brands';
import { actionCreators } from '../modules/list';
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
  connect(mapStateToProps, mapActions),
  graphql(profilesQuery, {
    name: 'profiles',
    skip: ({ auth }) => (auth.isAdministration ? false : !get(auth, 'hierarchyUsers.clients')),
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
