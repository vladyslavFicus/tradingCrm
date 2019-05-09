import { graphql, compose } from 'react-apollo';
import { withNotifications } from 'components/HighOrder';
import { clientQuery } from '../../graphql/queries/profile';
import { acceptPayment, changePaymentMethod, changePaymentStatus } from '../../graphql/mutations/payment';
import PaymentDetailModal from './PaymentDetailModal';

export default compose(
  withNotifications,
  graphql(acceptPayment, {
    name: 'acceptPayment',
  }),
  graphql(changePaymentMethod, {
    name: 'changePaymentMethod',
  }),
  graphql(changePaymentStatus, {
    name: 'changePaymentStatus',
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
