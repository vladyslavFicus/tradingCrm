import { connect } from 'react-redux';
import PaymentAccounts from '../components/PaymentAccounts';
import { actionCreators } from '../modules';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import { getApiRoot } from '../../../../../../../config';

const mapStateToProps = ({
  userPaymentAccounts: { list: { items: paymentAccounts, noResults } },
  profile: { profile: { data: { currencyCode } } },
  i18n: { locale },
}) => ({
  paymentAccounts,
  currencyCode,
  locale,
  noResults,
  filesUrl: `${getApiRoot()}/profile/files/download/`,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchFilesAndNotes: actionCreators.fetchFilesAndNotes,
  changeFileStatusByAction: actionCreators.changeFileStatusByAction,
  downloadFile: filesActionCreators.downloadFile,
  changePaymentAccountStatus: actionCreators.changePaymentAccountStatus,
};

export default connect(mapStateToProps, mapActions)(PaymentAccounts);
