import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import { getApiRoot } from '../../../../../config';

const mapStateToProps = ({
  userPaymentAccounts: { list: { items: paymentAccounts } },
  profile: { profile: { data: { currencyCode } } },
}) => ({
  paymentAccounts,
  currencyCode,
  filesUrl: `${getApiRoot()}/profile/files/download/`,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchFilesAndNotes: actionCreators.fetchFilesAndNotes,
  changeFileStatusByAction: actionCreators.changeFileStatusByAction,
  downloadFile: filesActionCreators.downloadFile,
};

export default connect(mapStateToProps, mapActions)(View);
