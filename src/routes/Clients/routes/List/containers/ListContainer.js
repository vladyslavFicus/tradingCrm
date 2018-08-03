import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import { actionCreators } from '../modules/list';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import List from '../components/List';
import config from '../../../../../config';
import countries from '../../../../../utils/countryList';
import { clientsQuery } from '../../../../../graphql/queries/clients';

const mapStateToProps = ({
  usersList: list,
  i18n: { locale },
  options: { data: { currencyCodes } },
  auth: { brandId, uuid },
}) => ({
  list,
  locale,
  tags: config.tags || [],
  currencies: currencyCodes,
  countries,
  auth: { brandId, uuid },
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default compose(
  connect(mapStateToProps, mapActions),
  graphql(clientsQuery, {
    name: 'clients',
    options: ({ location: { query } }) => ({
      variables: {
        ...query ? query.filters : { registrationDateFrom: moment().startOf('day').utc().format() },
        page: 1,
        size: 20,
      },
    }),
    props: ({ clients: { clients, fetchMore, ...rest } }) => {
      const newPage = get(clients, 'data.page') || 1;

      return {
        clients: {
          ...rest,
          clients,
          loadMoreClients: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.clients.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  clients: {
                    ...previousResult.clients,
                    ...fetchMoreResult.clients,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                clients: {
                  ...previousResult.clients,
                  ...fetchMoreResult.clients,
                  data: {
                    ...previousResult.clients.data,
                    ...fetchMoreResult.clients.data,
                    page: fetchMoreResult.clients.data.page,
                    content: [
                      ...previousResult.clients.data.content,
                      ...fetchMoreResult.clients.data.content,
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
