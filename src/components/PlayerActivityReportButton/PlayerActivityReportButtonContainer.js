import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withModals, withServiceCheck } from '@newage/react-hoc';
import { withNotifications } from '../../components/HighOrder';
import PlayerActivityReportButton from './PlayerActivityReportButton';
import PlayerActivityReportModal from '../PlayerActivityReportModal';

const mapStateToProps = ({ auth: { token } }) => ({ token });

export default compose(
  withModals({
    playerActivityReportModal: PlayerActivityReportModal,
  }),
  withNotifications,
  withServiceCheck,
  connect(mapStateToProps),
)(PlayerActivityReportButton);
