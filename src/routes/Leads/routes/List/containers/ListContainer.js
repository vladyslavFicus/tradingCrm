import { connect } from 'react-redux';
import { graphql, compose, withApollo } from 'react-apollo';
import { get, isEmpty } from 'lodash';
import update from 'immutability-helper';
import Modal from 'components/Modal';
import { withNotifications, withModals } from 'components/HighOrder';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { leadsQuery } from 'graphql/queries/leads';
import { bulkLeadPromote } from 'graphql/mutations/leads';
import { leadCsvUpload } from 'graphql/mutations/upload';
import countries from 'utils/countryList';
import { departments } from 'constants/brands';
import LeadsUploadModal from '../components/LeadsUploadModal/LeadsUploadModal';
import List from '../components/List';

const mapStateToProps = ({
  usersList: list,
  i18n: { locale },
  options: { data: { currencyCodes } },
  auth: { brandId, uuid, department },
}) => ({
  list,
  locale,
  currencies: currencyCodes,
  countries,
  auth: {
    brandId,
    uuid,
    isAdministration: department === departments.ADMINISTRATION,
  },
});

export default compose(
  withApollo,
  withNotifications,
  withModals({
    promoteInfoModal: Modal,
    leadsUploadModal: LeadsUploadModal,
    representativeModal: RepresentativeUpdateModal,
  }),
  connect(mapStateToProps),
  graphql(leadCsvUpload, {
    name: 'fileUpload',
  }),
  graphql(bulkLeadPromote, {
    name: 'promoteLead',
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
  graphql(leadsQuery, {
    name: 'leads',
    options: ({
      location: { query },
    }) => ({
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: {
        ...query && query.filters,
        page: 0,
        limit: 20,
      },
    }),
    props: ({ leads: { leads, fetchMore, ...rest }, ownProps: { location } }) => {
      let leadsResponse = leads ? { ...leads } : null;
      const newPage = get(leadsResponse, 'data.number') || 0;

      if (leadsResponse && !isEmpty(leadsResponse.data)) {
        const { totalElements, content, size: responseSize } = leadsResponse.data;
        const size = get(location, 'query.filters.size');

        if (size && totalElements >= size) {
          leadsResponse = update(leadsResponse, { data: { totalElements: { $set: size } } });

          if ((newPage + 1) * responseSize > size) {
            leadsResponse = update(leadsResponse, {
              data: {
                content: { $splice: [[size, content.length]] },
                last: { $set: true },
              },
            });
          }
        }
      }

      return {
        leads: {
          ...rest,
          leads: leadsResponse,
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
