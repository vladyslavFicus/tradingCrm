import React from 'react';
import { omit } from 'lodash';
import I18n from 'i18n-js';
import { LeadUploadResponse__FailedLeads as FailedLeads } from '__generated__/types';
import Modal from 'components/Modal';
import downloadUrl from 'utils/downloadUrl';
import './LeadsUploadResultModal.scss';

export type Props = {
  failedLeads: Array<FailedLeads>,
  failedLeadsCount: number,
  createdLeadsCount: number,
  onCloseModal: () => void,
};

const LeadsUploadResultModal = (props: Props) => {
  const { failedLeads, failedLeadsCount, createdLeadsCount, onCloseModal } = props;

  // ===== Handlers ===== //
  const handleCreateCsvFile = () => {
    const keys = Object.keys(failedLeads[0]).filter(key => key !== '__typename');

    const url = encodeURI(`data:text/csv;charset=utf-8, ${
      [
        keys,
        ...failedLeads.map(failedLead => (
          Object.values({
            ...omit(failedLead, ['__typename']),
            failureReason: I18n.t(`MODALS.LEADS_UPLOAD_RESULT_MODAL.FAILURE_REASON.${failedLead?.failureReason}`),
          })
        )),
      ].map(e => e.join(',')).join('\n')
    }`);

    downloadUrl('report.csv', url);
  };

  return (
    <Modal
      onCloseModal={onCloseModal}
      title={I18n.t('MODALS.LEADS_UPLOAD_RESULT_MODAL.TITLE')}
      styleButton="danger"
      buttonTitle={I18n.t('COMMON.BUTTONS.DOWNLOAD')}
      clickSubmit={handleCreateCsvFile}
    >
      <div className="LeadsUploadResultModal__row LeadsUploadResultModal__action-text">
        {I18n.t('MODALS.LEADS_UPLOAD_RESULT_MODAL.DESCRIPTION', { failedLeadsCount, createdLeadsCount })}
      </div>
    </Modal>
  );
};

export default React.memo(LeadsUploadResultModal);
