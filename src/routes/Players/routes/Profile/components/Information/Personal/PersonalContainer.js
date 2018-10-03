import { compose, graphql } from 'react-apollo/index';
import {
  updateBTAGMutation,
  updateAffiliateMutation,
  markIsTestMutation,
} from '../../../../../../../graphql/mutations/profile';
import { withModals, withNotifications } from '../../../../../../../components/HighOrder';
import UpdateFieldModal from '../../../../../../../components/UpdateFieldModal';
import Personal from './Personal';

export default compose(
  withModals({ updateFiledModal: UpdateFieldModal }),
  graphql(updateBTAGMutation, {
    name: 'updateBTAGMutation',
  }),
  graphql(updateAffiliateMutation, {
    name: 'updateAffiliateMutation',
  }),
  graphql(markIsTestMutation, {
    name: 'markIsTest',
  }),
  withNotifications,
)(Personal);
