import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as profileActionCreators } from '../../../modules';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import { statuses as kycStatuses } from '../../../../../constants/kyc';

const mapStateToProps = ({ profile: { profile }, i18n: { locale } }) => ({
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
    (profile.data.personalStatus && profile.data.personalStatus.value === kycStatuses.VERIFIED) ||
    (profile.data.addressStatus && profile.data.addressStatus.value === kycStatuses.VERIFIED)
  ),
  canVerifyAll: !profile.data.kycCompleted,
  locale,
});
const mapActions = {
  fetchProfile: profileActionCreators.fetchProfile,
  updateIdentifier: profileActionCreators.updateIdentifier,
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
};

export default connect(mapStateToProps, mapActions)(View);
