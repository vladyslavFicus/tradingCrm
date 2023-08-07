import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import useDocuments from 'routes/Documents/routes/hooks/useDocuments';
import './DocumentsHeader.scss';

const DocumentsHeader = () => {
  const {
    allowUploadDocument,
    totalElements,
    handleAddDocumentModal,
  } = useDocuments();

  return (
    <div className="DocumentsHeader__card">
      <div className="DocumentsHeader__headline">
        <strong>{totalElements} </strong>

        {I18n.t('DOCUMENTS.GRID.HEADLINE')}
      </div>

      <If condition={allowUploadDocument}>
        <Button
          secondary
          className="DocumentsHeader__header-button"
          data-testid="DocumentsHeader-uploadFileButton"
          onClick={handleAddDocumentModal}
          type="button"
        >
          {I18n.t('DOCUMENTS.GRID.UPLOAD_FILE')}
        </Button>
      </If>
    </div>
  );
};

export default React.memo(DocumentsHeader);
