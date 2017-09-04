import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as profileActionCreators } from '../../../modules';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import { statuses as kycStatuses } from '../../../../../constants/kyc';
import { getApiRoot } from '../../../../../config';

const mapStateToProps = ({ profile: { profile, files }, i18n: { locale } }) => ({
  profile,
  personalData: {
    title: profile.data.title,
    firstName: profile.data.firstName,
    lastName: profile.data.lastName,
    birthDate: profile.data.birthDate,
    identifier: profile.data.identifier,
    gender: profile.data.gender,
  },
  addressData: {
    country: profile.data.country,
    city: profile.data.city,
    postCode: profile.data.postCode,
    address: profile.data.address,
  },
  contactData: {
    email: profile.data.email,
    phoneNumber: profile.data.phoneNumber,
  },
  canRefuseAll: (
    (profile.data.kycPersonalStatus && profile.data.kycPersonalStatus.status === kycStatuses.VERIFIED) ||
    (profile.data.kycAddressStatus && profile.data.kycAddressStatus.status === kycStatuses.VERIFIED)
  ),
  files,
  canVerifyAll: !profile.data.kycCompleted,
  locale,
  filesUrl: `${getApiRoot()}/profile/files/download/`,
});
const mapActions = {
  fetchProfile: profileActionCreators.fetchProfile,
  submitData: profileActionCreators.submitData,
  verifyData: profileActionCreators.verifyData,
  refuseData: profileActionCreators.refuseData,
  updateProfile: profileActionCreators.updateProfile,
  uploadFile: profileActionCreators.uploadProfileFile,
  downloadFile: filesActionCreators.downloadFile,
  checkLock: profileActionCreators.checkLock,
  changeFileStatusByAction: profileActionCreators.changeFileStatusByAction,
  verifyPhone: profileActionCreators.verifyPhone,
  verifyEmail: profileActionCreators.verifyEmail,
  manageKycNote: profileActionCreators.manageKycNote,
  resetNote: profileActionCreators.resetNote,
  sendKycRequestVerification: profileActionCreators.sendKycRequestVerification,
  verifyKycAll: profileActionCreators.verifyKycAll,
  fetchKycReasons: profileActionCreators.fetchKycReasons,
};

export default connect(mapStateToProps, mapActions)(View);
