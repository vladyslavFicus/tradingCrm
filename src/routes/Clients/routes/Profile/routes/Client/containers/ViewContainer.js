import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as profileActionCreators } from '../../../modules';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import { statuses as kycStatuses } from '../../../../../../../constants/kyc';
import { getApiRoot } from '../../../../../../../config';
import Permissions from '../../../../../../../utils/permissions';
import permissions from '../../../../../../../config/permissions';

const updateProfilePermissions = new Permissions(permissions.USER_PROFILE.UPDATE_PROFILE);

const mapStateToProps = ({
  profile: { profile, files },
  i18n: { locale },
  permissions: currentPermissions,
  options,
}) => {
  const {
    email,
    title,
    firstName,
    lastName,
    birthDate,
    identifier,
    gender,
    country,
    city,
    postCode,
    address,
    languageCode,
    tradingProfile,
  } = profile.data;

  const { phone1, phone2 } = tradingProfile || {};

  return {
    profile,
    personalData: {
      title, firstName, lastName, birthDate, identifier, gender, languageCode,
    },
    addressData: {
      country, city, postCode, address,
    },
    contactData: { email, phone1, phone2 },
    canRefuseAll: (
      (profile.data.kycPersonalStatus && profile.data.kycPersonalStatus.status === kycStatuses.VERIFIED) ||
      (profile.data.kycAddressStatus && profile.data.kycAddressStatus.status === kycStatuses.VERIFIED)
    ),
    files,
    meta: options,
    canVerifyAll: !profile.data.kycCompleted,
    locale,
    filesUrl: `${getApiRoot()}/profile/files/download/`,
    canUpdateProfile: updateProfilePermissions.check(currentPermissions.data),
  };
};
const mapActions = {
  fetchProfile: profileActionCreators.fetchProfile,
  submitData: profileActionCreators.submitData,
  verifyData: profileActionCreators.verifyData,
  refuseData: profileActionCreators.refuseData,
  updateProfile: profileActionCreators.updateProfile,
  updatePhone: profileActionCreators.updatePhone,
  updateEmail: profileActionCreators.updateEmail,
  uploadFile: profileActionCreators.uploadProfileFile,
  downloadFile: filesActionCreators.downloadFile,
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
