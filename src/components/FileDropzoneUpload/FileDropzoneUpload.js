import React from 'react';
import Dropzone from 'react-dropzone';
import I18n from 'i18n-js';
import classNames from 'classnames';
import './FileDropzoneUpload.scss';

const FileDropzoneUpload = props => (
  <Dropzone
    {...props}
    className={classNames('FileDropzoneUpload', props.className)}
    activeClassName={classNames('FileDropzoneUpload-active', props.activeClassName)}
    acceptClassName={classNames('FileDropzoneUpload-accept', props.acceptClassName)}
  >
    <div className="FileDropzoneUpload-content">
      <img src="/img/upload-icon.svg" className="FileDropzoneUpload-upload-image" alt="" />
      <div className="FileDropzoneUpload-info">
        <p>{I18n.t('FILE_DROPZONE.DRAG_HERE_OR')}</p>
        <button type="button" className="FileDropzoneUpload-button">{I18n.t('FILE_DROPZONE.BROWSE_FILES')}</button>
      </div>
    </div>
  </Dropzone>
);

FileDropzoneUpload.propTypes = Dropzone.propTypes;

export default FileDropzoneUpload;
