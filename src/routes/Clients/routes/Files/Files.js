import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import FilesGrid from './components/FilesGrid';
import FilesGridFilter from './components/FilesGridFilter';
import './Files.scss';

class Files extends PureComponent {
  render() {
    return (
      <div className="Files">
        <div className="Files__header">
          <div className="Files__title">{I18n.t('COMMON.KYC_DOCUMENTS')}</div>
        </div>

        <FilesGridFilter />
        <FilesGrid />
      </div>
    );
  }
}

export default Files;
