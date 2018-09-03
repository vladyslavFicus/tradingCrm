import { compose, graphql } from 'react-apollo/index';
import {
  updateBTAGMutation,
  updateAffiliateMutation
} from '../../../../../../../graphql/mutations/profile';
import { withModals } from '../../../../../../../components/HighOrder';
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
)(Personal);
