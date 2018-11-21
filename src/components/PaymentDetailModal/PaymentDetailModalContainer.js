import { graphql } from 'react-apollo';
import { clientQuery } from '../../graphql/queries/profile';
import PaymentDetailModal from './PaymentDetailModal';

export default graphql(clientQuery, {
  name: 'profile',
  options: ({ payment: { playerUUID } }) => ({
    variables: {
      playerUUID,
    },
  }),
})(PaymentDetailModal);
