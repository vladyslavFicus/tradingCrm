import React, { PureComponent, Fragment } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withNotifications, withModals } from 'hoc';
import { getGraphQLUrl, getVersion } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import downloadBlob from 'utils/downloadBlob';
import EventEmitter, {
  PROFILE_RELOAD,
  FILE_REMOVED,
  FILE_CHANGED,
  FILE_UPLOADED,
} from 'utils/EventEmitter';
import { Button } from 'components/UI';
import TabHeader from 'components/TabHeader';
import PermissionContent from 'components/PermissionContent';
import NotFoundContent from 'components/NotFoundContent';
import { UploadModal } from 'components/Files';
import KYCNote from './components/KYCNote';
import FileGrid from './components/FileGrid';
import {
  FilesCategoriesQuery,
  FilesByProfileUuidQuery,
  TokenRefreshMutation,
  UpdateFileStatusMutation,
  UpdateFileMetaMutation,
} from './graphql';

class ClientFilesTab extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      uploadModal: PropTypes.modalType,
    }).isRequired,
    filesByProfileUuidQuery: PropTypes.query({
      clientFiles: PropTypes.pageable(PropTypes.fileEntity),
    }).isRequired,
    filesCategoriesQuery: PropTypes.query({
      filesCategories: PropTypes.object.isRequired,
    }).isRequired,
    tokenRenew: PropTypes.func.isRequired,
    updateFileMeta: PropTypes.func.isRequired,
    updateFileStatus: PropTypes.func.isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.refetchFiles);
    EventEmitter.on(FILE_UPLOADED, this.refetchFiles);
    EventEmitter.on(FILE_REMOVED, this.refetchFiles);
    EventEmitter.on(FILE_CHANGED, this.refetchFiles);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.refetchFiles);
    EventEmitter.off(FILE_UPLOADED, this.refetchFiles);
    EventEmitter.off(FILE_REMOVED, this.refetchFiles);
    EventEmitter.off(FILE_CHANGED, this.refetchFiles);
  }

  refetchFiles = () => {
    this.props.filesByProfileUuidQuery.refetch();
  };

  handlePageChanged = () => {
    const {
      filesByProfileUuidQuery: {
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
    const { notify, updateFileStatus } = this.props;

    try {
      await updateFileStatus({
        variables: {
          verificationType,
          documentType,
          verificationStatus,
        },
      });

      this.refetchFiles();

      notify({
        level: 'success',
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('FILES.STATUS_CHANGED'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleVerificationTypeClick = async (uuid, verificationType, documentType) => {
    const { updateFileMeta, notify } = this.props;

    try {
      await updateFileMeta({
        variables: {
          uuid,
          verificationType,
          documentType,
        },
      });

      this.refetchFiles();

      notify({
        level: 'success',
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('FILES.DOCUMENT_TYPE_CHANGED'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleChangeFileStatusClick = async (status, uuid) => {
    const { updateFileMeta, notify } = this.props;

    try {
      await updateFileMeta({
        variables: {
          status,
          uuid,
        },
      });

      this.refetchFiles();

      notify({
        level: 'success',
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('FILES.CHANGED_FILE_STATUS'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleDownloadFileClick = async ({ uuid, fileName }) => {
    const {
      match: { params: { id } },
      tokenRenew,
    } = this.props;

    try {
      const { data: { auth: { tokenRenew: { token } } } } = await tokenRenew();

      const requestUrl = `${getGraphQLUrl()}/attachment/${id}/${uuid}`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-client-version': getVersion(),
        },
      });

      const blobData = await response.blob();

      downloadBlob(fileName, blobData);
    } catch (e) {
      // Do nothing...
    }
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
      filesByProfileUuidQuery,
      filesCategoriesQuery,
      match: { params: { id } },
      updateFileMeta,
      tokenRenew,
    } = this.props;

    const verificationData = filesByProfileUuidQuery.data?.clientFiles || [];
    const { __typename, ...categories } = filesCategoriesQuery.data?.filesCategories || {};

    if (filesCategoriesQuery.loading) {
      return null;
    }

    return (
      <Fragment>
        <TabHeader title={I18n.t('FILES.TITLE')}>
          <PermissionContent permissions={permissions.FILES.UPLOAD_FILE}>
            <Button
              onClick={this.handleUploadFileClick}
              primaryOutline
              small
            >
              {I18n.t('COMMON.BUTTONS.UPLOAD_FILE')}
            </Button>
          </PermissionContent>
        </TabHeader>
        <KYCNote playerUUID={id} />
        <Choose>
          <When condition={verificationData.length}>
            {
              verificationData.map(({ documents, verificationType }) => (
                documents.map(({ documentType, files, verificationStatus, verificationTime }) => (
                  <FileGrid
                    key={`${verificationType}-${documentType}-${verificationTime}`}
                    data={files}
                    categories={categories}
                    verificationType={verificationType}
                    verificationStatus={verificationStatus}
                    updateFileMeta={updateFileMeta}
                    documentType={documentType}
                    tokenRenew={tokenRenew}
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

export default compose(
  withNotifications,
  withModals({
    uploadModal: UploadModal,
  }),
  withRequests({
    filesCategoriesQuery: FilesCategoriesQuery,
    filesByProfileUuidQuery: FilesByProfileUuidQuery,
    tokenRenew: TokenRefreshMutation,
    updateFileMeta: UpdateFileMetaMutation,
    updateFileStatus: UpdateFileStatusMutation,
  }),
)(ClientFilesTab);
