import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import history from 'router/history';
import { I18n } from 'react-redux-i18n';
import TabHeader from 'components/TabHeader';
import { withNotifications } from 'components/HighOrder';
import { targetTypes as fileTargetTypes } from 'components/Files/constants';
import PermissionContent from 'components/PermissionContent';
import { getApiRoot } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import FilesFilterForm from './FilesFilterForm';
import CommonFileGridView from '../../../components/CommonFileGridView';

class Files extends Component {
  static contextTypes = {
    showImages: PropTypes.func.isRequired,
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
  };

  static propTypes = {
    files: PropTypes.shape({
      data: PropTypes.pageable(PropTypes.fileEntity),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      deleteModal: PropTypes.modalType,
    }).isRequired,
    downloadFile: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    updateFileStatus: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.setFileChangedCallback(this.props.files.refetch);
  }

  componentWillUnmount() {
    this.context.setFileChangedCallback(null);
  }

  handlePageChanged = () => {
    const {
      files: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleStatusActionClick = async (uuid, documentStatus) => {
    const { files: { refetch }, notify } = this.props;

    const { data: { file: { updateFileStatus: { success } } } } = await this.props.updateFileStatus({
      variables: {
        fileUUID: uuid,
        documentStatus,
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

  handleDownloadFileClick = (data) => {
    this.props.downloadFile(data);
  };

  handleDeleteFile = uuid => async () => {
    const {
      notify,
      modals: { deleteModal },
    } = this.props;

    const { data: { file: { delete: { error } } } } = await this.props.delete({ variables: { uuid } });

    deleteModal.hide();

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILES.CONFIRM_ACTION_MODAL.FILE_NOT_DELETED'),
      });
    } else {
      this.props.files.refetch();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILES.CONFIRM_ACTION_MODAL.FILE_DELETED'),
      });
    }
  }

  handleDeleteFileClick = (data) => {
    const { deleteModal } = this.props.modals;

    deleteModal.show({
      onSubmit: this.handleDeleteFile(data.uuid),
      modalTitle: I18n.t('FILES.CONFIRM_ACTION_MODAL.TITLE'),
      actionText: I18n.t('FILES.CONFIRM_ACTION_MODAL.ACTION_TEXT', {
        fileName: data.name,
      }),
      submitButtonLabel: I18n.t('FILES.CONFIRM_ACTION_MODAL.BUTTONS.DELETE'),
    });
  }

  handlePreviewImageClick = (data) => {
    this.context.showImages(`${getApiRoot()}/profile/files/download/${data.uuid}`, data.type);
  };

  render() {
    const {
      files,
      files: { loading },
    } = this.props;

    const entities = get(files, 'files', { content: [], totalPages: 0, number: 0 });

    return (
      <Fragment>
        <TabHeader title={I18n.t('FILES.TITLE')}>
          <PermissionContent permissions={permissions.FILES.UPLOAD_FILE}>
            <button
              type="button"
              className="btn btn-sm btn-primary-outline"
              onClick={() => this.context.onUploadFileClick({
                targetType: fileTargetTypes.FILES,
              })}
            >
              {I18n.t('COMMON.BUTTONS.UPLOAD_FILE')}
            </button>
          </PermissionContent>
        </TabHeader>
        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <CommonFileGridView
            dataSource={entities.content}
            totalPages={entities.totalPages}
            activePage={entities.number + 1}
            last={entities.last}
            loading={loading && entities.content.length === 0}
            lazyLoad
            onPageChange={this.handlePageChanged}
            onStatusActionClick={this.handleStatusActionClick}
            onDownloadFileClick={this.handleDownloadFileClick}
            onDeleteFileClick={this.handleDeleteFileClick}
            onPreviewImageClick={this.handlePreviewImageClick}
            showNoResults={entities.content.length === 0}
          />
        </div>
      </Fragment>
    );
  }
}

export default withNotifications(Files);
