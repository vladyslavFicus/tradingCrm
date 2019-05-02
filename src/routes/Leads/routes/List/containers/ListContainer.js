import { connect } from 'react-redux';
import { graphql, compose, withApollo } from 'react-apollo';
import Modal from 'components/Modal';
import { withNotifications, withModals } from 'components/HighOrder';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import countries from 'utils/countryList';
import limitItems from 'utils/limitItems';
import { leadsQuery } from 'graphql/queries/leads';
import { bulkLeadPromote } from 'graphql/mutations/leads';
import { leadCsvUpload } from 'graphql/mutations/upload';
import { departments } from 'constants/brands';
import LeadsUploadModal from '../components/LeadsUploadModal/LeadsUploadModal';
import List from '../components/List';

const mapStateToProps = ({
  usersList: list,
  i18n: { locale },
  auth: { brandId, uuid, department },
}) => ({
  list,
  locale,
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
  graphql(leadsQuery, {
    name: 'leads',
    options: ({
      location: { query },
    }) => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        ...query && query.filters,
        requestId: Math.random().toString(36).slice(2),
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
  })
)(List);
