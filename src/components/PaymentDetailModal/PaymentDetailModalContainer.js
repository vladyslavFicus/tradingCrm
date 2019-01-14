import { graphql, compose } from 'react-apollo';
import { clientQuery } from '../../graphql/queries/profile';
import { acceptPayment } from '../../graphql/mutations/payment';
import PaymentDetailModal from './PaymentDetailModal';

export default compose(
  graphql(acceptPayment, {
    name: 'acceptPayment',
  }),
  graphql(clientQuery, {
    options: ({
      payment: {
        playerProfile: { uuid },
      },
    }) => ({
      variables: {
        playerUUID: uuid,
      },
    }),
    name: 'playerProfile',
  })
)(PaymentDetailModal);
