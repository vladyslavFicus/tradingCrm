import { compose } from 'react-apollo';
import Header from './Header';
import ConfirmActionModal from '../../../../../../components/Modal/ConfirmActionModal';
import { withModals, withNotifications } from '../../../../../../components/HighOrder';

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  withNotifications,
)(Header);
