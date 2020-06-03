import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { getApiRoot, getApiVersion } from 'config';
import { withNotifications } from 'hoc';
import TabHeader from 'components/TabHeader';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import downloadBlob from 'utils/downloadBlob';
import EventEmitter, { PROFILE_RELOAD, FILE_REMOVED, FILE_UPLOADED } from 'utils/EventEmitter';
import NotFoundContent from 'components/NotFoundContent';
import KYCNote from './KYCNote';
import FileGrid from './FileGrid';

class Files extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    filesList: PropTypes.shape({
      data: PropTypes.pageable(PropTypes.fileEntity),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    getFilesCategoriesList: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      uploadModal: PropTypes.modalType,
    }).isRequired,
    updateFileStatus: PropTypes.func.isRequired,
    updateFileMeta: PropTypes.func.isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.on(FILE_UPLOADED, this.onFileEvent);
    EventEmitter.on(FILE_REMOVED, this.onFileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.off(FILE_UPLOADED, this.onFileEvent);
    EventEmitter.off(FILE_REMOVED, this.onFileEvent);
  }

  onProfileEvent = () => {
    this.props.filesList.refetch();
  };

  onFileEvent = () => {
    this.props.filesList.refetch();
  };

  handlePageChanged = () => {
    const {
      filesList: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (filters = {}) => this.props.history.replace({ query: { filters } });

  handleStatusActionClick = async (
    verificationType,
    documentType,
    verificationStatus,
  ) => {
    const { filesList: { refetch }, notify } = this.props;

    const { data: { file: { updateFileStatus: { success } } } } = await this.props.updateFileStatus({
      variables: {
        verificationType,
        documentType,
        verificationStatus,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('FILES.TITLE'),
      message: success
        ? I18n.t('FILES.STATUS_CHANGED')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      refetch();
    }
  };

  handleVerificationTypeClick = async (uuid, verificationType, documentType) => {
    const { filesList: { refetch }, notify } = this.props;

    const { data: { file: { updateFileMeta: { success } } } } = await this.props.updateFileMeta({
      variables: {
        uuid,
        verificationType,
        documentType,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('FILES.TITLE'),
      message: success
        ? I18n.t('FILES.DOCUMENT_TYPE_CHANGED')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      refetch();
    }
  };

  handleChangeFileStatusClick = async (status, uuid) => {
    const { notify } = this.props;

    const { data: { file: { updateFileMeta: { success } } } } = await this.props.updateFileMeta({
      variables: { status, uuid },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('FILES.TITLE'),
      message: success
        ? I18n.t('FILES.CHANGED_FILE_STATUS')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });
  };

  handleDownloadFileClick = async ({ uuid, fileName }) => {
    const {
      match: { params: { id } },
      token,
    } = this.props;

    const requestUrl = `${getApiRoot()}/attachments/users/${id}/files/${uuid}`;

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'image/*',
        authorization: `Bearer ${token}`,
        'X-CLIENT-Version': getApiVersion(),
        'Content-Type': 'application/json',
      },
    });

    const blobData = await response.blob();

    downloadBlob(fileName, blobData);
  };

  handleUploadFileClick = () => {
    const {
      match: { params: { id: profileUUID } },
      modals: { uploadModal },
    } = this.props;

    uploadModal.show({ profileUUID });
  };

  render() {
    const {
      filesList,
      getFilesCategoriesList,
      getFilesCategoriesList: { loading },
      match: { params: { id } },
    } = this.props;

    const verificationData = get(filesList, 'filesByUuid.data') || [];
    const { __typename, ...categories } = get(getFilesCategoriesList, 'filesCategoriesList.data') || {};

    if (loading) {
      return null;
    }

    return (
      <Fragment>
        <TabHeader title={I18n.t('FILES.TITLE')}>
          <PermissionContent permissions={permissions.FILES.UPLOAD_FILE}>
            <button
              type="button"
              className="btn btn-sm btn-primary-outline"
              onClick={this.handleUploadFileClick}
            >
              {I18n.t('COMMON.BUTTONS.UPLOAD_FILE')}
            </button>
          </PermissionContent>
        </TabHeader>
        <KYCNote playerUUID={id} />
        <Choose>
          <When condition={verificationData.length}>
            {
              verificationData.map(({ documents, verificationType }) => (
                documents.map(({ documentType, files, verificationStatus }) => (
                  <FileGrid
                    key={`${verificationType}-${documentType}`}
                    data={files}
                    categories={categories}
                    verificationType={verificationType}
                    verificationStatus={verificationStatus}
                    documentType={documentType}
                    handlePageChanged={this.handlePageChanged}
                    onStatusActionClick={this.handleStatusActionClick}
                    onVerificationTypeActionClick={this.handleVerificationTypeClick}
                    onChangeFileStatusActionClick={this.handleChangeFileStatusClick}
                    onDownloadFileClick={this.handleDownloadFileClick}
                  />
                ))
              ))
            }
          </When>
          <Otherwise>
            <NotFoundContent />
          </Otherwise>
        </Choose>
      </Fragment>
    );
  }
}

export default withNotifications(Files);
