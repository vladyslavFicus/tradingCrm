import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { addNoteMutation } from 'graphql/mutations/note';
import { addPaymentMutation } from 'graphql/mutations/payment';
import { getClientPaymentsByUuid } from 'graphql/queries/payments';
import { newProfile } from 'graphql/queries/profile';
import { withStorage } from 'providers/StorageProvider';
import { withModals } from 'components/HighOrder';
import Payments from '../components/Payments';
import PaymentAddModal from '../components/PaymentAddModal';

export default compose(
  withStorage(['auth']),
  withModals({ addPayment: PaymentAddModal }),
  graphql(addNoteMutation, {
    name: 'addNote',
  }),
  graphql(addPaymentMutation, {
    name: 'addPayment',
  }),
  graphql(newProfile, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'newProfile',
  }),
  graphql(getClientPaymentsByUuid, {
    name: 'clientPayments',
    options: ({
      match: { params: { id: playerUUID } },
      location: { query },
    }) => ({
      variables: {
        accountType: 'LIVE',
        ...query && query.filters,
        playerUUID,
        page: 0,
        limit: 20,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ clientPayments: { clientPaymentsByUuid, fetchMore, ...rest } }) => {
      const newPage = get(clientPaymentsByUuid, 'data.number', 0);

      return {
        clientPayments: {
          ...rest,
          clientPaymentsByUuid,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.clientPaymentsByUuid.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  clientPaymentsByUuid: {
                    ...previousResult.clientPaymentsByUuid,
                    ...fetchMoreResult.clientPaymentsByUuid,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                clientPaymentsByUuid: {
                  ...previousResult.clientPaymentsByUuid,
                  ...fetchMoreResult.clientPaymentsByUuid,
                  data: {
                    ...previousResult.clientPaymentsByUuid.data,
                    ...fetchMoreResult.clientPaymentsByUuid.data,
                    content: [
                      ...previousResult.clientPaymentsByUuid.data.content,
                      ...fetchMoreResult.clientPaymentsByUuid.data.content,
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
)(Payments);
