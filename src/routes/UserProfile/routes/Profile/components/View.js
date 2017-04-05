import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import Documents from './Documents';
import VerifyData from './Kyc/VerifyData';
import RefuseModal from './Kyc/RefuseModal';
import { types as kycTypes, categories as kycCategories } from '../../../../../constants/kyc';

const REFUSE_MODAL = 'refuse-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    profile: PropTypes.shape({
      data: PropTypes.userProfile.isRequired,
      receivedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    }),
    submitData: PropTypes.func.isRequired,
    verifyData: PropTypes.func.isRequired,
    refuseData: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    changeStatusByAction: PropTypes.func.isRequired,
    personalData: PropTypes.shape({
      title: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      birthDate: PropTypes.string,
      identifier: PropTypes.string,
      gender: PropTypes.string,
    }),
    addressData: PropTypes.shape({
      country: PropTypes.string,
      city: PropTypes.string,
      postCode: PropTypes.string,
      address: PropTypes.string,
    }),
    contactData: PropTypes.shape({
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
    canVerifyAll: PropTypes.bool.isRequired,
    canRefuseAll: PropTypes.bool.isRequired,
    updateIdentifier: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
  };

  handleSubmitPersonal = async (data) => {
    const { params: { id }, submitData, updateIdentifier, profile } = this.props;

    const action = await submitData(id, kycTypes.personal, data);

    if (action && !action.error && data.identifier !== profile.data.identifier) {
      updateIdentifier(id, data.identifier);
    }

    return action;
  };

  handleSubmitAddress = (data) => {
    const { params: { id }, submitData } = this.props;

    return submitData(id, kycTypes.address, data);
  };

  handleSubmitContact = (data) => {
    const { params, updateProfile } = this.props;

    updateProfile(params.id, data);
  };

  handleVerify = type => () => {
    this.props.verifyData(this.props.params.id, type);
  };

  handleVerifyAll = () => {
    const { verifyData, params } = this.props;

    return Promise.all([
      verifyData(params.id, kycCategories.KYC_PERSONAL),
      verifyData(params.id, kycCategories.KYC_ADDRESS),
    ]);
  };

  handleRefuse = async (data) => {
    const { refuseData, params } = this.props;

    if (data[kycCategories.KYC_PERSONAL]) {
      await refuseData(params.id, kycCategories.KYC_PERSONAL, { reason: data[`${kycCategories.KYC_PERSONAL}_reason`] });
    }
    if (data[kycCategories.KYC_ADDRESS]) {
      await refuseData(params.id, kycCategories.KYC_ADDRESS, { reason: data[`${kycCategories.KYC_ADDRESS}_reason`] });
    }

    this.handleCloseModal();
  };

  handleRefuseClick = (type) => {
    this.handleOpenModal(REFUSE_MODAL, {
      initialValues: {
        [type]: true,
      },
    });
  };

  handleRefuseAllClick = () => {
    this.handleOpenModal(REFUSE_MODAL, {
      initialValues: {
        [kycCategories.KYC_PERSONAL]: true,
        [kycCategories.KYC_ADDRESS]: true,
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
    const { params, changeStatusByAction, fetchProfile } = this.props;
    const action = await changeStatusByAction(uuid, fileAction);

    if (action && !action.error) {
      fetchProfile(params.id);
    }
  };

  render() {
    const { modal } = this.state;
    const {
      profile: { data, receivedAt },
      personalData,
      addressData,
      contactData,
      canVerifyAll,
      canRefuseAll,
      downloadFile,
    } = this.props;

    if (!receivedAt) {
      return null;
    }

    return (
      <div className="player__account__page_profile tab-content padding-vertical-20">
        <div className="row margin-bottom-20">
          <div className="col-md-6">
            <div className="h3 margin-bottom-0">KYC Request</div>
            <span className="font-size-12">
              sent on {moment(data.kycDate).format('DD.MM.YYYY')}
            </span>
          </div>
          <div className="col-md-6 text-right">
            {
              canRefuseAll &&
              <div className="display-inline-block margin-inline">
                <button className="btn btn-sm btn-danger-outline" onClick={this.handleRefuseAllClick}>
                  Refuse All
                </button>
              </div>
            }

            {
              canVerifyAll &&
              <div className="display-inline-block margin-inline">
                <button className="btn btn-sm btn-success-outline" onClick={this.handleVerifyAll}>
                  Verify All
                </button>
              </div>
            }
          </div>
        </div>

        <div className="tab-pane active">
          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8 profile-bordered-block">
                <PersonalForm
                  initialValues={personalData}
                  onSubmit={this.handleSubmitPersonal}
                />
                <hr />
                <Documents
                  onChangeStatus={this.handleChangeFileStatus}
                  onUpload={this.handleUploadDocument(kycCategories.KYC_PERSONAL)}
                  onDownload={downloadFile}
                  files={data.personalKycMetaData}
                />
              </div>
              <div className="col-md-4">
                <VerifyData
                  title="Identity"
                  description="In order to get verified we require at least one valid proof of Identification. The ID or Passport scan need to be sharp with clear picture, readable and not expired or damaged."
                  onVerify={this.handleVerify(kycCategories.KYC_PERSONAL)}
                  onRefuse={() => this.handleRefuseClick(kycCategories.KYC_PERSONAL)}
                  status={data.personalStatus}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8 profile-bordered-block">
                <AddressForm
                  initialValues={addressData}
                  onSubmit={this.handleSubmitAddress}
                />
                <hr />
                <Documents
                  onChangeStatus={this.handleChangeFileStatus}
                  onUpload={this.handleUploadDocument(kycCategories.KYC_ADDRESS)}
                  onDownload={downloadFile}
                  files={data.addressKycMetaData}
                />
              </div>
              <div className="col-md-4">
                <VerifyData
                  title="Address"
                  description="Proof of address can be any document showing your name and proof of address AND a date of issuing not older than 6 months from moment of providing."
                  onVerify={this.handleVerify(kycCategories.KYC_ADDRESS)}
                  onRefuse={() => this.handleRefuseClick(kycCategories.KYC_ADDRESS)}
                  status={data.addressStatus}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8">
                <ContactForm
                  initialValues={contactData}
                  onSubmit={this.handleSubmitContact}
                />
              </div>
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
        </div>
      </div>
    );
  }
}

export default View;
