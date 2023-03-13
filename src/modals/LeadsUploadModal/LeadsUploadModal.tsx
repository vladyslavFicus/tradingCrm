import React, { useState } from 'react';
import I18n from 'i18n-js';
import Dropzone from 'react-dropzone';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import { parseErrors } from 'apollo';
import { LeadUploadResponse__FailedLeads as FailedLeads } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { useUploadLeadsMutation } from './graphql/__generated__/UploadLeadsMutation';
import './LeadsUploadModal.scss';

const fileConfig = {
  maxSize: 10,
  types: 'text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export type Props = {
  onSuccess: (failedLeads: Array<FailedLeads>,
    failedLeadsCount?: number | null, createdLeadsCount?: number | null) => void,
  onCloseModal: () => void,
};

const LeadsUploadModal = (props: Props) => {
  const {
    onSuccess,
    onCloseModal,
  } = props;

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [uploadLeadsMutation] = useUploadLeadsMutation();

  const handleRejectUpload = ([file]: Array<File>) => {
    if (file.size > fileConfig.maxSize) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: I18n.t('error.multipart.max-file-size.exceeded', { size: fileConfig.maxSize }),
      });
    }
  };

  const handleUploadCSV = async ([file]: Array<File>) => {
    setSubmitting(true);

    try {
      const { data } = await uploadLeadsMutation({ variables: { file } });
      const { leads } = data || {};

      if (!leads?.uploadLeads?.failedLeads?.length) {
        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('COMMON.UPLOAD_SUCCESSFUL'),
        });
      }

      setSubmitting(false);

      onCloseModal();
      onSuccess(leads?.uploadLeads?.failedLeads as Array<FailedLeads>,
        leads?.uploadLeads?.failedLeadsCount, leads?.uploadLeads?.createdLeadsCount);
    } catch (e) {
      const error = parseErrors(e);

      const errorMessage = error.errorParameters?.errorMessage || error.message || 'COMMON.SOMETHING_WRONG';

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: I18n.t(errorMessage),
      });

      setSubmitting(false);

      onCloseModal();
    }
  };

  return (
    <Modal className="LeadsUploadModal" isOpen toggle={onCloseModal}>
      <ModalHeader toggle={onCloseModal}>
        {I18n.t('LEADS.LEADS_UPLOAD_MODAL.TITLE')}
      </ModalHeader>

      <ModalBody>
        <div className="LeadsUploadModal__desc">
          <div className="LeadsUploadModal__desc-title">
            {I18n.t('LEADS.LEADS_UPLOAD_MODAL.UPLOAD_CSV_TO_IMPORT_LEADS')}
          </div>

          <div className="LeadsUploadModal__desc-subtitle">
            {`${I18n.t('LEADS.LEADS_UPLOAD_MODAL.SAMPLE_CSV')}: `}

            <a href="/uploads/leads/sample.csv" target="_blank">sample.csv</a>
          </div>
        </div>

        <Dropzone
          disabled={submitting}
          accept={fileConfig.types}
          maxSize={fileConfig.maxSize * 1024 * 1024}
          onDropAccepted={handleUploadCSV}
          onDropRejected={handleRejectUpload}
          className={
              classNames(
                'LeadsUploadModal__dropzone',
                {
                  'LeadsUploadModal__dropzone--submitting': submitting,
                },
              )
            }
          activeClassName="LeadsUploadModal__dropzone-active"
          acceptClassName="LeadsUploadModal__dropzone-accept"
        >
          <div className="LeadsUploadModal__dropzone-content">
            <img src="/img/upload-icon.svg" className="LeadsUploadModal__dropzone-upload-image" alt="" />

            <div className="LeadsUploadModal__dropzone-info">
              <p>{I18n.t('FILE_DROPZONE.DRAG_HERE_OR')}</p>

              <Button
                secondary
                submitting={submitting}
                className={classNames('LeadsUploadModal__dropzone-button', {
                  'LeadsUploadModal__dropzone-button--submitting': submitting,
                })}
              >
                {I18n.t('FILE_DROPZONE.BROWSE_FILES')}
              </Button>
            </div>
          </div>
        </Dropzone>
      </ModalBody>

      <ModalFooter>
        <Button
          secondary
          onClick={onCloseModal}
        >
          {I18n.t('COMMON.CANCEL')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(LeadsUploadModal);
