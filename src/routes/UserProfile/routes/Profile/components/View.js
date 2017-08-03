import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import PropTypes from '../../../../../constants/propTypes';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import Documents from './Documents';
import VerifyData from './Kyc/VerifyData';
import RefuseModal from './Kyc/RefuseModal';
import renderLabel from '../../../../../utils/renderLabel';
import RequestKycVerificationModal from './Kyc/RequestKycVerificationModal';
import {
  types as kycTypes,
  categories as kycCategories,
  statuses as kycStatuses,
  userStatuses as kycUserStatuses,
  userStatusesLabels as kycUserStatusesLabels,
  userStatusesColor as kycUserStatusesColor,
} from '../../../../../constants/kyc';
import './View.scss';

const REFUSE_MODAL = 'refuse-modal';
const REQUEST_KYC_VERIFICATION_MODAL = 'request-kyc-verification-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    profile: PropTypes.shape({
      data: PropTypes.userProfile.isRequired,
    }).isRequired,
    files: PropTypes.shape({
      identity: PropTypes.arrayOf(PropTypes.fileEntity).isRequired,
      address: PropTypes.arrayOf(PropTypes.fileEntity).isRequired,
    }).isRequired,
    submitData: PropTypes.func.isRequired,
    verifyData: PropTypes.func.isRequired,
    refuseData: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    changeFileStatusByAction: PropTypes.func.isRequired,
    personalData: PropTypes.shape({
      title: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      birthDate: PropTypes.string,
      identifier: PropTypes.string,
      gender: PropTypes.string,
    }).isRequired,
    addressData: PropTypes.shape({
      country: PropTypes.string,
      city: PropTypes.string,
      postCode: PropTypes.string,
      address: PropTypes.string,
    }).isRequired,
    contactData: PropTypes.shape({
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
    }).isRequired,
    checkLock: PropTypes.func.isRequired,
    verifyPhone: PropTypes.func.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    filesUrl: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    manageKycRequestNote: PropTypes.func.isRequired,
    resetNote: PropTypes.func.isRequired,
    sendKycRequestVerification: PropTypes.func.isRequired,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
    showImages: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    refreshPinnedNotes: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
  };

  handleSubmitKYC = type => async (data) => {
    const { params: { id }, submitData } = this.props;

    const action = await submitData(id, type, data);
    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
        message: `Update ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }

    return action;
  };

  handleSubmitContact = async (data) => {
    const { params, updateProfile } = this.props;

    const action = await updateProfile(params.id, { phoneNumber: data.phoneNumber });
    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
          ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }
    return action;
  };

  handleVerify = type => async () => {
    const { verifyData, params, checkLock } = this.props;

    await verifyData(params.id, type);
    checkLock(params.id);
  };

  handleRefuse = async (data) => {
    const { refuseData, params, checkLock } = this.props;

    if (data[kycCategories.KYC_PERSONAL]) {
      await refuseData(params.id, kycCategories.KYC_PERSONAL, { reason: data[`${kycCategories.KYC_PERSONAL}_reason`] });
    }
    if (data[kycCategories.KYC_ADDRESS]) {
      await refuseData(params.id, kycCategories.KYC_ADDRESS, { reason: data[`${kycCategories.KYC_ADDRESS}_reason`] });
    }

    checkLock(params.id);
    this.handleCloseModal();
  };

  handleRequestKycVerify = async (inputParams) => {
    const {
      params: { id: playerUUID },
      profile: { kycRequestNote: unsavedNote },
      sendKycRequestVerification,
      resetNote,
    } = this.props;

    const action = await sendKycRequestVerification(playerUUID, inputParams);

    if (action && !action.error) {
      if (unsavedNote) {
        this.context.onAddNote({ ...unsavedNote, targetUUID: playerUUID });
        if (unsavedNote.pinned) {
          this.context.refreshPinnedNotes();
        }
      }
    }

    this.handleCloseModal(resetNote);
  }

  handleRefuseClick = (type) => {
    this.handleOpenModal(REFUSE_MODAL, {
      initialValues: {
        [type]: true,
      },
    });
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        name,
        params,
      },
    });
  };

  handleOpenRequestKycVerificationModal = () => {
    const { profile: { data: { playerUUID, fullName } } } = this.props;

    this.handleOpenModal(REQUEST_KYC_VERIFICATION_MODAL, {
      playerUUID,
      fullName,
    });
  };

  handleCloseModal = (cb) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleUploadDocument = type => async (errors, file) => {
    const { params, uploadFile, fetchProfile } = this.props;

    const action = await uploadFile(params.id, type, file);

    if (action && !action.error) {
      fetchProfile(params.id);
    }
  };

  handleChangeFileStatus = async (uuid, fileAction) => {
    const { params, changeFileStatusByAction, fetchProfile } = this.props;
    const action = await changeFileStatusByAction(uuid, fileAction);

    if (action && !action.error) {
      fetchProfile(params.id);
    }
  };

  handleVerifyPhone = async (phoneNumber) => {
    const { params, profile, verifyPhone, updateProfile } = this.props;

    if (phoneNumber !== profile.data.phoneNumber) {
      await updateProfile(params.id, { phoneNumber });
    }

    return verifyPhone(params.id);
  };

  handleVerifyEmail = async (email) => {
    const { params, profile, verifyEmail, updateProfile } = this.props;

    if (email !== profile.data.email) {
      await updateProfile(params.id, { email });
    }

    return verifyEmail(params.id);
  };

  handlePreviewImageClick = (data) => {
    this.context.showImages(`${this.props.filesUrl}${data.uuid}`, data.type);
  };

  renderKycStatusTitle = () => {
    const { profile: { data: profile } } = this.props;

    let kycUserStatusCode = kycUserStatuses.NOT_REQUESTED;
    if (profile.kycAddressStatus && profile.kycPersonalStatus) {
      kycUserStatusCode = profile.kycAddressStatus.status === kycStatuses.VERIFIED &&
      profile.kycPersonalStatus.status === kycStatuses.VERIFIED ?
        kycUserStatuses.VERIFIED : kycUserStatuses.NOT_VERIFIED;
    }

    return (
      <div>
        {I18n.t('PLAYER_PROFILE.PROFILE.TITLE')} {' - '}
        <span className={classNames(kycUserStatusesColor[kycUserStatusCode], 'font-weight-600')}>
          {renderLabel(kycUserStatusCode, kycUserStatusesLabels)}
        </span>
      </div>
    );
  }

  render() {
    const { modal } = this.state;
    const {
      profile: { data, receivedAt, kycRequestNote },
      files,
      personalData,
      addressData,
      contactData,
      downloadFile,
      locale,
      manageKycRequestNote,
    } = this.props;

    if (!receivedAt) {
      return null;
    }

    return (
      <div>
        <div className="row margin-bottom-20">
          <div className="col-xl-6">
            <div className="font-size-20">
              {this.renderKycStatusTitle()}
            </div>
          </div>
          <div className="col-sm-6 col-xs-6 text-right">
            <button
              type="button"
              className="btn btn-sm btn-primary-outline"
              onClick={this.handleOpenRequestKycVerificationModal}
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.REQUEST_KYC_VERIFICATION')}
            </button>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel-body row panel-body__wrapper">
              <div className="col-md-8 profile-bordered-block">
                <PersonalForm
                  initialValues={personalData}
                  onSubmit={this.handleSubmitKYC(kycTypes.personal)}
                />
                <hr />
                <Documents
                  onChangeStatus={this.handleChangeFileStatus}
                  onUpload={this.handleUploadDocument(kycCategories.KYC_PERSONAL)}
                  onDownload={downloadFile}
                  files={files.identity}
                  onDocumentClick={this.handlePreviewImageClick}
                />
              </div>
              <div className="col-md-4">
                <VerifyData
                  title={I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_PERSONAL_DATA_TITLE')}
                  onVerify={this.handleVerify(kycCategories.KYC_PERSONAL)}
                  onRefuse={() => this.handleRefuseClick(kycCategories.KYC_PERSONAL)}
                  status={data.kycPersonalStatus}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body row panel-body__wrapper">
              <div className="col-md-8 profile-bordered-block">
                <AddressForm
                  initialValues={addressData}
                  onSubmit={this.handleSubmitKYC(kycTypes.address)}
                />
                <hr />
                <Documents
                  onChangeStatus={this.handleChangeFileStatus}
                  onUpload={this.handleUploadDocument(kycCategories.KYC_ADDRESS)}
                  onDownload={downloadFile}
                  files={files.address}
                  onDocumentClick={this.handlePreviewImageClick}
                />
              </div>
              <div className="col-md-4">
                <VerifyData
                  title={I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_ADDRESS_DATA_TITLE')}
                  onVerify={this.handleVerify(kycCategories.KYC_ADDRESS)}
                  onRefuse={() => this.handleRefuseClick(kycCategories.KYC_ADDRESS)}
                  status={data.kycAddressStatus}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body row">
              <ContactForm
                profile={data}
                initialValues={contactData}
                onSubmit={this.handleSubmitContact}
                onVerifyPhoneClick={this.handleVerifyPhone}
                onVerifyEmailClick={this.handleVerifyEmail}
              />
            </div>
          </div>

          {
            modal.name === REFUSE_MODAL &&
            <RefuseModal
              {...modal.params}
              profile={data}
              isOpen
              onSubmit={this.handleRefuse}
              onClose={this.handleCloseModal}
            />
          }

          {
            modal.name === REQUEST_KYC_VERIFICATION_MODAL &&
            <RequestKycVerificationModal
              note={kycRequestNote}
              locale={locale}
              title={I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.TITLE')}
              show
              {...modal.params}
              onSubmit={this.handleRequestKycVerify}
              onClose={this.handleCloseModal}
              onManageNote={manageKycRequestNote}
            />
          }
        </div>
      </div>
    );
  }
}

export default View;
