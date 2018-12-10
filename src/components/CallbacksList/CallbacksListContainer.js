import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withModals } from '../HighOrder';
import CallbackDetailsModal from '../CallbackDetailsModal';
import CallbacksList from './CallbacksList';

const mapStateToProps = ({ auth: { brandId, uuid } }) => ({
  auth: {
    brandId,
    uuid,
  },
});

export default compose(
  withRouter,
  withModals({
    callbackDetails: CallbackDetailsModal,
  }),
  connect(mapStateToProps),
)(CallbacksList);
