import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import FileDropzoneUploadModal from '../../../../../../components/FileDropzoneUploadModal/index';
import { fileConfig } from '../../../../constants';
import './LeadsUploadModal.scss';

class LeadsUploadModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  };

  renderTopContent = () => (
    <div className="LeadsUploadModal-beforeContent">
      <p className="font-weight-bold">{I18n.t('LEADS.LEADS_UPLOAD_MODAL.UPLOAD_CSV_TO_IMPORT_LEADS')}</p>
      <p>
        {`${I18n.t('LEADS.LEADS_UPLOAD_MODAL.SAMPLE_CSV')}: `}
        <a href="/uploads/leads-upload.csv" target="_blank">leads-upload.csv</a>
      </p>
    </div>
  );

  render() {
    return (
      <FileDropzoneUploadModal
        {...this.props}
        title={I18n.t('LEADS.LEADS_UPLOAD_MODAL.TITLE')}
        contentClassName="LeadsUploadModal-content"
        renderTopContent={this.renderTopContent()}
        accept={fileConfig.types}
        maxSize={fileConfig.maxSize * 1024 * 1024}
      />
    );
  }
}

export default LeadsUploadModal;
