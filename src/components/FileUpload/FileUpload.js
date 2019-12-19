import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileButton from '../FileButton';

class FileUpload extends Component {
  static propTypes = {
    onChosen: PropTypes.func.isRequired,
    allowedSize: PropTypes.number,
    incorrectFileSize: PropTypes.string,
    invalidFileType: PropTypes.string,
    allowedTypes: PropTypes.array,
    singleMode: PropTypes.bool,
  };

  static defaultProps = {
    allowedSize: 16,
    allowedTypes: [],
    incorrectFileSize: 'FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.SIZE_LIMIT_ERROR',
    invalidFileType: 'FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.FILE_TYPE_ERROR',
    singleMode: true,
  };

  handleChoose = (files) => {
    const errors = !this.props.singleMode
      ? Object.keys(files).map(index => this.validate(files[index]))
      : this.validate(files);

    this.props.onChosen(errors, files);
  };

  validate = (file) => {
    const errors = [];

    if (!file) {
      return errors;
    }

    const {
      incorrectFileSize,
      invalidFileType,
      allowedTypes,
      allowedSize,
    } = this.props;

    if (allowedTypes.length && allowedTypes.indexOf(file.type) === -1) {
      errors.push(invalidFileType);
    }

    if (file.size > allowedSize * (1024 * 1024)) {
      errors.push(incorrectFileSize);
    }

    return errors;
  };

  render() {
    return (
      <FileButton
        {...this.props}
        onChosen={this.handleChoose}
      />
    );
  }
}

export default FileUpload;
