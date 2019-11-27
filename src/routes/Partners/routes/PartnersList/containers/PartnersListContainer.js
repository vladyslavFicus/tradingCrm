import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';
import { graphql, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { partnersQuery } from 'graphql/queries/partners';
import { createPartner } from 'graphql/mutations/partners';
import { withModals, withNotifications } from 'components/HighOrder';
import PartnersList from '../components/PartnersList';
import CreatePartnerModalContainer from '../components/CreatePartnerModal';

const mapStateToProps = state => ({
  filterValues: getFormValues('partnersListGridFilter')(state) || {},
});

export default compose(
  connect(mapStateToProps),
  withApollo,
  withModals({ createPartner: CreatePartnerModalContainer }),
  withNotifications,
  graphql(createPartner, {
    name: 'submitNewPartner',
  }),
  graphql(partnersQuery, {
    name: 'operators',
    options: ({ location: { query } }) => ({
      variables: {
        ...query && query.filters,
        page: 0,
        size: 20,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ operators: { partners, fetchMore, ...rest } }) => {
      const newPage = get(partners, 'data.page') || 0;

      return {
        operators: {
          ...rest,
          operators: partners,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.partners.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  operators: {
                    ...previousResult.partners,
                    ...fetchMoreResult.partners,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                operators: {
                  ...previousResult.partners,
                  ...fetchMoreResult.partners,
                  data: {
                    ...previousResult.partners.data,
                    ...fetchMoreResult.partners.data,
                    page: fetchMoreResult.partners.data.page,
                    content: [
                      ...previousResult.partners.data.content,
                      ...fetchMoreResult.partners.data.content,
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
)(PartnersList);
