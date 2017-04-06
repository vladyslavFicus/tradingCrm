import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as profileActionCreators } from '../../../modules';
import { statuses as kycStatuses } from '../../../../../constants/kyc';

const mapStateToProps = ({ profile: { view: { profile } } }) => ({
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
    fullAddress: profile.data.address,
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
});
const mapActions = {
  fetchProfile: profileActionCreators.fetchProfile,
  updateIdentifier: profileActionCreators.updateIdentifier,
  submitData: profileActionCreators.submitData,
  verifyData: profileActionCreators.verifyData,
  refuseData: profileActionCreators.refuseData,
  updateProfile: profileActionCreators.updateProfile,
  uploadFile: profileActionCreators.uploadFile,
  downloadFile: profileActionCreators.downloadFile,
  changeStatusByAction: profileActionCreators.changeStatusByAction,
};

export default connect(mapStateToProps, mapActions)(View);
