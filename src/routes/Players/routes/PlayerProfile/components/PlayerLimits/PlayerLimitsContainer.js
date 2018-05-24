import { compose } from 'redux';
import PlayerLimits from './PlayerLimits';
import ConfirmActionModal from '../../../../../../components/Modal/ConfirmActionModal';
import { withModals } from '../../../../../../components/HighOrder';

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
)(PlayerLimits);
