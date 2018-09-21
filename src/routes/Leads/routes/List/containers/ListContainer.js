import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import List from '../components/List';
import { withNotifications } from '../../../../../components/HighOrder';
import countries from '../../../../../utils/countryList';
import { leadsQuery } from '../../../../../graphql/queries/leads';
import { promoteLeadToClient } from '../../../../../graphql/mutations/leads';
import { leadCsvUpload } from '../../../../../graphql/mutations/upload';
import { leadsSizePerQuery } from '../components/constants';

const mapStateToProps = ({
  usersList: list,
  i18n: { locale },
  options: { data: { currencyCodes } },
  auth: { brandId, uuid, hierarchyUsers },
}) => ({
  list,
  locale,
  currencies: currencyCodes,
  countries,
  auth: { brandId, uuid, hierarchyUsers },
});

export default compose(
  withNotifications,
  connect(mapStateToProps),
  graphql(leadCsvUpload, {
    name: 'fileUpload',
  }),
  graphql(promoteLeadToClient, {
    name: 'promoteLead',
  }),
  graphql(leadsQuery, {
    name: 'leads',
    skip: ({ auth }) => !get(auth, 'hierarchyUsers.leads'),
    options: ({
      location: { query },
      auth: { hierarchyUsers: { leads: ids } },
    }) => ({
      variables: {
        ...query
          ? query.filters
          : {
            registrationDateStart: moment().startOf('day').utc().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
          },
        page: 0,
        limit: leadsSizePerQuery,
        ids,
      },
    }),
    props: ({ leads: { leads, fetchMore, ...rest } }) => {
      const newPage = get(leads, 'data.number') || 0;
      return {
        leads: {
          ...rest,
          leads,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.leads.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  leads: {
                    ...previousResult.leads,
                    ...fetchMoreResult.leads,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                leads: {
                  ...previousResult.leads,
                  ...fetchMoreResult.leads,
                  data: {
                    ...previousResult.leads.data,
                    ...fetchMoreResult.leads.data,
                    page: fetchMoreResult.leads.data.page,
                    content: [
                      ...previousResult.leads.data.content,
                      ...fetchMoreResult.leads.data.content,
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
