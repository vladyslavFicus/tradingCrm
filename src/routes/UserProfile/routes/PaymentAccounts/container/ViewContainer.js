import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { actionCreators as filesActionCreators } from '../../../modules/files';

const mapStateToProps = ({
  userPaymentAccounts: { list: { items: paymentAccounts } },
}) => ({
  paymentAccounts,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchFilesAndNotes: actionCreators.fetchFilesAndNotes,
  changeStatusByAction: actionCreators.changeStatusByAction,
  downloadFile: filesActionCreators.downloadFile,
};

export default connect(mapStateToProps, mapActions)(View);
