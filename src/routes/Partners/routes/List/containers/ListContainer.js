import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';
import { graphql } from 'react-apollo';
import { get } from 'lodash';
import { actionCreators as authoritiesActionCreators } from 'redux/modules/auth/authorities';
import { actionCreators as miniProfileActionCreators } from 'redux/modules/miniProfile';
import { partnersQuery } from 'graphql/queries/partners';
import { createPartner } from 'graphql/mutations/partners';
import { withModals, withNotifications } from 'components/HighOrder';
import List from 'routes/Operators/routes/List/components/List';
import { operatorTypes } from 'constants/operators';
import CreatePartnerModalContainer from '../components/CreatePartnerModal';

const mapStateToProps = ({
  operatorsList: list,
  i18n: { locale },
  auth: { uuid },
  ...state
}) => ({
  list,
  locale,
  operatorId: uuid,
  filterValues: getFormValues('operatorsListGridFilter')(state) || {},
  operatorType: operatorTypes.PARTNER,
});

const mapActions = {
  fetchOperatorMiniProfile: miniProfileActionCreators.fetchOperatorProfile,
  fetchAuthorities: authoritiesActionCreators.fetchAuthorities,
  fetchAuthoritiesOptions: authoritiesActionCreators.fetchAuthoritiesOptions,
};

export default compose(
  connect(mapStateToProps, mapActions),
  withModals({ createOperator: CreatePartnerModalContainer }),
  withNotifications,
  graphql(createPartner, {
    name: 'submitNewOperator',
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
)(List);
