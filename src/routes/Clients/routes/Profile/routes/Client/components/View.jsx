import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import PropTypes from '../../../../../../../constants/propTypes';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import RefuseModal from './Kyc/RefuseModal';
import SimpleConfirmationModal from './Kyc/SimpleConfirmationModal';
import RequestKycVerificationModal from './Kyc/RequestKycVerificationModal';
import {
  types as kycTypes,
  categories as kycCategories,
} from '../../../../../../../constants/kyc';
import { kycNoteTypes } from '../constants';
import './View.scss';
import TabHeader from '../../../../../../../components/TabHeader';
import PermissionContent from '../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../config/permissions';

const REFUSE_MODAL = 'refuse-modal';
const VERIFY_MODAL = 'verify-modal';
const REQUEST_KYC_VERIFICATION_MODAL = 'request-kyc-verification-modal';
const KYC_VERIFY_ALL_MODAL = 'kyc-verify-all-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    profile: PropTypes.shape({
      data: PropTypes.object.isRequired,
      kycReasons: PropTypes.shape({
        refuse: PropTypes.array,
        request: PropTypes.array,
      }),
    }).isRequired,
    files: PropTypes.shape({
      identity: PropTypes.arrayOf(PropTypes.fileEntity).isRequired,
      address: PropTypes.arrayOf(PropTypes.fileEntity).isRequired,
    }).isRequired,
    submitData: PropTypes.func.isRequired,
    verifyData: PropTypes.func.isRequired,
    refuseData: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    updatePhone: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
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
      phoneCode: PropTypes.string,
      phone: PropTypes.string,
    }).isRequired,
    meta: PropTypes.meta.isRequired,
    verifyPhone: PropTypes.func.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    filesUrl: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    manageKycNote: PropTypes.func.isRequired,
    resetNote: PropTypes.func.isRequired,
    sendKycRequestVerification: PropTypes.func.isRequired,
    verifyKycAll: PropTypes.func.isRequired,
    fetchKycReasons: PropTypes.func.isRequired,
    canUpdateProfile: PropTypes.bool,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
    showImages: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
  };
  static defaultProps = {
    canUpdateProfile: false,
  };

  state = {
    modal: { ...modalInitialState },
  };

  async componentDidMount() {
    const kycReasonsAction = await this.props.fetchKycReasons();

    console.info('kycReasonsAction');
    console.info(kycReasonsAction ? JSON.stringify(kycReasonsAction.payload) : kycReasonsAction);
  }

  onManageKycNote = type => (data) => {
    this.props.manageKycNote(type, data);
  };

  handleSubmitKYC = type => async (data) => {
    const { match: { params: { id } }, submitData } = this.props;

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

  handleUpdatePhone = async () => {
    // will be rewritten soon |> use data as input func param <|

    /* const { match: { params }, updatePhone } = this.props;
    const { phone, phoneCode, phone2, phoneCode2 } = data;

    const action = await updatePhone(params.id, { phone, phoneCode, phone2, phoneCode2 });

    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
          ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }
    return action; */
  };

  handleUpdateEmail = async (data) => {
    const { match: { params }, updateEmail } = this.props;

    const action = await updateEmail(params.id, data);

    if (action) {
      if (!action.error) {
        this.context.addNotification({
          level: 'success',
          title: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.TITLE'),
          message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
        });
      } else {
        throw new SubmissionError({ email: I18n.t(action.payload.response.error) });
      }
    }

    return action;
  };

  handleVerify = async () => {
    const {
      match: { params: { id: playerUUID } },
      profile: { notes: { verify: unsavedNote } },
      verifyData,
    } = this.props;
    const { modal: { params: { verifyType } } } = this.state;

    const action = await verifyData(playerUUID, verifyType);
    if (action) {
      if (action.error) {
        const message = kycCategories.KYC_ADDRESS ?
          I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.VERIFY_KYC.ERROR') :
          I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.VERIFY_KYC.ERROR');
        this.context.addNotification({
          level: 'error',
          title: I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC.TITLE'),
          message,
        });
      } else if (unsavedNote) {
        this.context.onAddNote({ variables: { ...unsavedNote, targetUUID: playerUUID } });
      }
    }

    if (action && !action.error) {
      console.info(`Verify success - ${verifyType}`);
    }
    this.handleCloseModal();
    this.handleResetNote(kycNoteTypes.verify);
  };

  handleRefuse = async (data) => {
    const {
      refuseData,
      profile: { notes: { refuse: unsavedNote } },
      match: { params: { id: playerUUID } },
    } = this.props;

    if (data[kycCategories.KYC_PERSONAL]) {
      await refuseData(playerUUID, kycCategories.KYC_PERSONAL, {
        reason: data[`${kycCategories.KYC_PERSONAL}_reason`],
      });
    }
    if (data[kycCategories.KYC_ADDRESS]) {
      await refuseData(playerUUID, kycCategories.KYC_ADDRESS, {
        reason: data[`${kycCategories.KYC_ADDRESS}_reason`],
      });
    }

    if (unsavedNote) {
      this.context.onAddNote({ variables: { ...unsavedNote, targetUUID: playerUUID } });
    }

    this.handleCloseModal();
    this.handleResetNote(kycNoteTypes.refuse);
  };

  handleResetNote = type => this.props.resetNote(type);

  handleRequestKycVerify = async (inputParams) => {
    const {
      match: { params: { id: playerUUID } },
      profile: { notes: { kycRequest: unsavedNote } },
      sendKycRequestVerification,
    } = this.props;

    const action = await sendKycRequestVerification(playerUUID, inputParams);

    if (action && !action.error) {
      if (unsavedNote) {
        this.context.onAddNote({ variables: { ...unsavedNote, targetUUID: playerUUID } });
      }
    }

    this.handleCloseModal();
    this.handleResetNote(kycNoteTypes.kycRequest);
  };

  handleKycVerifyAll = async () => {
    const {
      match: { params: { id: playerUUID } },
      profile: { notes: { verifyAll: unsavedNote } },
      verifyKycAll,
    } = this.props;

    const action = await verifyKycAll(playerUUID);

    if (action && !action.error) {
      if (unsavedNote) {
        this.context.onAddNote({ variables: { ...unsavedNote, targetUUID: playerUUID } });
      }
    }

    this.handleCloseModal();
    this.handleResetNote(kycNoteTypes.verifyAll);
  };

  handleRefuseClick = (type) => {
    const { profile: { kycReasons: { refuse } } } = this.props;

    this.handleOpenModal(REFUSE_MODAL, {
      reasons: refuse,
      initialValues: {
        [type]: true,
      },
    });
  };

  handleVerifyClick = (verifyType) => {
    const { profile: { data: { fullName } } } = this.props;

    console.info(`Verify button clicked - ${verifyType}`);
    const kycVerifyModalStaticParams = {};
    if (verifyType === kycCategories.KYC_PERSONAL) {
      kycVerifyModalStaticParams.modalTitle =
        I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC.MODAL.TITLE.PERSONAL');
      kycVerifyModalStaticParams.actionText =
        I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC.MODAL.ACTION_TEXT.PERSONAL', { fullName });
      kycVerifyModalStaticParams.submitButtonLabel =
        I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC.MODAL.SUBMIT_BUTTON_LABEL.PERSONAL');
    } else if (verifyType === kycCategories.KYC_ADDRESS) {
      kycVerifyModalStaticParams.modalTitle =
        I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC.MODAL.TITLE.ADDRESS');
      kycVerifyModalStaticParams.actionText =
        I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC.MODAL.ACTION_TEXT.ADDRESS', { fullName });
      kycVerifyModalStaticParams.submitButtonLabel =
        I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC.MODAL.SUBMIT_BUTTON_LABEL.ADDRESS');
    }

    this.handleOpenModal(VERIFY_MODAL, {
      verifyType,
      ...kycVerifyModalStaticParams,
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
    const { profile: { data: { playerUUID, fullName }, kycReasons: { request } } } = this.props;

    this.handleOpenModal(REQUEST_KYC_VERIFICATION_MODAL, {
      playerUUID,
      fullName,
      reasons: request,
    });
  };

  handleOpenVerifyKycAllModal = () => {
    const { profile: { data: { fullName } } } = this.props;

    this.handleOpenModal(KYC_VERIFY_ALL_MODAL, {
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC_ALL.MODAL.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC_ALL.MODAL.ACTION_TEXT', { fullName }),
      submitButtonLabel: I18n.t('PLAYER_PROFILE.PROFILE.VERIFY_KYC_ALL.MODAL.SUBMIT_BUTTON_LABEL'),
    });
  };

  handleCloseModal = (cb) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleUploadDocument = type => (errors, file) => {
    const { match: { params }, uploadFile } = this.props;

    uploadFile(params.id, type, file);
  };

  handleChangeFileStatus = async (uuid, fileAction) => {
    const { match: { params }, changeFileStatusByAction, fetchProfile } = this.props;
    const action = await changeFileStatusByAction(uuid, fileAction);

    if (action && !action.error) {
      fetchProfile(params.id);
    }
  };

  handleVerifyPhone = async (phone, phoneCode) => {
    const {
      match: { params }, profile, verifyPhone, updatePhone,
    } = this.props;
    const { phone: currentPhone, phoneCode: currentPhoneCode } = profile.data;

    if (phone !== currentPhone || phoneCode !== currentPhoneCode) {
      await updatePhone(params.id, { phone, phoneCode });
    }

    return verifyPhone(params.id);
  };

  handleVerifyEmail = async (email) => {
    const {
      match: { params }, profile, verifyEmail, updateProfile,
    } = this.props;

    if (email !== profile.data.email) {
      await updateProfile(params.id, { email });
    }

    return verifyEmail(params.id);
  };

  handlePreviewImageClick = (data) => {
    this.context.showImages(`${this.props.filesUrl}${data.uuid}`, data.type);
  };

  render() {
    const { modal } = this.state;

    if (!this.props.profile.data.playerUUID) {
      return null;
    }

    const {
      profile: {
        data,
        receivedAt,
        notes: {
          kycRequest,
          verify,
          verifyAll,
          refuse,
        },
      },
      meta: {
        data: metaData,
      },
      personalData,
      addressData,
      contactData,
      locale,
      canUpdateProfile,
    } = this.props;

    if (!receivedAt) {
      return null;
    }

    return (
      <Fragment>
        <TabHeader title={I18n.t('CLIENT_PROFILE.PROFILE.TITLE')}>
          <PermissionContent permissions={permissions.USER_PROFILE.REQUEST_KYC}>
            <button
              id="request-kyc-button"
              type="button"
              className="btn btn-sm btn-primary-outline"
              onClick={this.handleOpenRequestKycVerificationModal}
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.REQUEST_KYC_VERIFICATION')}
            </button>
          </PermissionContent>
        </TabHeader>
        <div className="tab-wrapper">
          <div className="client-flex-wrapper">
            <div className="client-big-col">
              <div className="card margin-right-20">
                <div className="card-body">
                  <PersonalForm
                    initialValues={personalData}
                    onSubmit={this.handleSubmitKYC(kycTypes.personal)}
                    disabled={!canUpdateProfile}
                  />
                </div>
              </div>
              <div className="card margin-right-20">
                <div className="card-body">
                  <AddressForm
                    meta={{
                      countries: metaData.countries,
                      countryCodes: metaData.countryCodes,
                    }}
                    initialValues={addressData}
                    onSubmit={this.handleSubmitKYC(kycTypes.address)}
                    disabled={!canUpdateProfile}
                  />
                </div>
              </div>
            </div>
            <div className="client-small-col">
              <div className="card">
                <div className="card-body">
                  <ContactForm
                    profile={data}
                    contactData={contactData}
                    onSubmitPhone={this.handleUpdatePhone}
                    onSubmitEmail={this.handleUpdateEmail}
                    onVerifyPhoneClick={this.handleVerifyPhone}
                    onVerifyEmailClick={this.handleVerifyEmail}
                    disabled={!canUpdateProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          modal.name === REFUSE_MODAL &&
          <RefuseModal
            note={refuse}
            {...modal.params}
            profile={data}
            onSubmit={this.handleRefuse}
            onClose={this.handleCloseModal}
            onManageNote={this.onManageKycNote(kycNoteTypes.refuse)}
          />
        }

        {
          modal.name === VERIFY_MODAL &&
          <SimpleConfirmationModal
            note={verify}
            {...modal.params}
            form="verifyModal"
            profile={data}
            onSubmit={this.handleVerify}
            onClose={this.handleCloseModal}
            onManageNote={this.onManageKycNote(kycNoteTypes.verify)}
          />
        }

        {
          modal.name === REQUEST_KYC_VERIFICATION_MODAL &&
          <RequestKycVerificationModal
            note={kycRequest}
            locale={locale}
            title={I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.TITLE')}
            show
            {...modal.params}
            onSubmit={this.handleRequestKycVerify}
            onClose={this.handleCloseModal}
            onManageNote={this.onManageKycNote(kycNoteTypes.kycRequest)}
          />
        }

        {
          modal.name === KYC_VERIFY_ALL_MODAL &&
          <SimpleConfirmationModal
            note={verifyAll}
            form="verifyAllModal"
            locale={locale}
            {...modal.params}
            profile={data}
            onSubmit={this.handleKycVerifyAll}
            onClose={this.handleCloseModal}
            onManageNote={this.onManageKycNote(kycNoteTypes.verifyAll)}
          />
        }
      </Fragment>
    );
  }
}

export default View;
