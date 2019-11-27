import { graphql, compose, withApollo } from 'react-apollo';
import Modal from 'components/Modal';
import { withNotifications, withModals } from 'components/HighOrder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import limitItems from 'utils/limitItems';
import { leadsQuery } from 'graphql/queries/leads';
import { bulkLeadPromote } from 'graphql/mutations/leads';
import { leadCsvUpload } from 'graphql/mutations/upload';
import LeadsUploadModal from '../components/LeadsUploadModal/LeadsUploadModal';
import List from '../components/List';

export default compose(
  withApollo,
  withNotifications,
  withModals({
    promoteInfoModal: Modal,
    leadsUploadModal: LeadsUploadModal,
    representativeModal: RepresentativeUpdateModal,
    confirmationModal: ConfirmActionModal,
  }),
  graphql(leadCsvUpload, {
    name: 'fileUpload',
  }),
  graphql(bulkLeadPromote, {
    name: 'promoteLead',
  }),
  graphql(leadsQuery, {
    name: 'leads',
    options: ({
      location: { query },
    }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        ...query && query.filters,
        page: 0,
        limit: 20,
      },
    }),
    props: ({ leads: { leads, fetchMore, ...rest }, ownProps: { location } }) => {
      const { response, currentPage } = limitItems(leads, location);

      return {
        leads: {
          ...rest,
          leads: response,
          loadMore: () => fetchMore({
            variables: { page: currentPage + 1 },
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
  }),
)(List);
