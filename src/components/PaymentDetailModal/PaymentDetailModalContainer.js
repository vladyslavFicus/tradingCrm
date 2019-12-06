import { graphql, compose } from 'react-apollo';
import { withNotifications } from 'components/HighOrder';
import { newProfile as newProfileQuery } from 'graphql/queries/profile';
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
  graphql(newProfileQuery, {
    name: 'newProfile',
    options: ({
      payment: {
        playerProfile: { uuid },
      },
    }) => ({
      variables: {
        playerUUID: uuid,
      },
    }),
  }),
)(PaymentDetailModal);
