import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/Buttons';
import TabHeader from 'components/TabHeader';
import PermissionContent from 'components/PermissionContent';
import { UploadFileModal } from 'modals/FileModals';
import KYCNote from './components/KYCNote';
import ClientFilesGrid from './components/ClientFilesGrid';

class ClientFilesTab extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      uploadModal: PropTypes.modalType,
    }).isRequired,
  };

  handleUploadFileClick = () => {
    const {
      match: {
        params: {
          id: profileUUID,
        },
      },
      modals: {
        uploadModal,
      },
    } = this.props;

    uploadModal.show({ profileUUID });
  };

  render() {
    const {
      match: {
        params: {
          id: profileUUID,
        },
      },
    } = this.props;

    return (
      <Fragment>
        <TabHeader title={I18n.t('FILES.TITLE')}>
          <PermissionContent permissions={permissions.FILES.UPLOAD_FILE}>
            <Button
              data-testid="uploadFileButton"
              onClick={this.handleUploadFileClick}
              tertiary
              small
            >
              {I18n.t('COMMON.BUTTONS.UPLOAD_FILE')}
            </Button>
          </PermissionContent>
        </TabHeader>
        <KYCNote playerUUID={profileUUID} />
        <ClientFilesGrid />
      </Fragment>
    );
  }
}

export default withModals({
  uploadModal: UploadFileModal,
})(ClientFilesTab);
