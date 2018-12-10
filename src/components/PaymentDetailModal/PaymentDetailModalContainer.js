import { graphql } from 'react-apollo';
import { clientQuery } from '../../graphql/queries/profile';
import PaymentDetailModal from './PaymentDetailModal';

export default graphql(clientQuery, {
  options: ({
    profileId: playerUUID,
  }) => ({
    variables: {
      playerUUID,
    },
  }),
  name: 'playerProfile',
})(PaymentDetailModal);
