import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { statuses as kycStatuses } from 'constants/kyc';
import { updateMutation } from 'graphql/mutations/profile';
import { clientQuery } from 'graphql/queries/profile';
import { getApiRoot } from 'config';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { actionCreators as profileActionCreators } from '../../../modules';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import View from '../components/View';

const updateProfilePermissions = new Permissions(permissions.USER_PROFILE.UPDATE_PROFILE);

const mapStateToProps = ({
  profile: { profile, files },
  i18n: { locale },
  permissions: currentPermissions,
  options,
}) => {
  const {
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
  } = profile.data;

  return {
    profile,
    personalData: {
      title, firstName, lastName, birthDate, identifier, gender, languageCode,
    },
    addressData: {
      country, city, postCode, address,
    },
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

export default compose(
  connect(mapStateToProps, mapActions),
  graphql(updateMutation, {
    name: 'profileUpdate',
    options: ({ match: { params: { id: playerUUID } } }) => ({ variables: { playerUUID } }),
  }),
  graphql(clientQuery, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'playerProfile',
  }),
)(View);
