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
    allowedSize: 2,
    allowedTypes: [],
    incorrectFileSize: 'Incorrect file size',
    invalidFileType: 'Invalid file type',
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

    const { allowedTypes, allowedSize } = this.props;

    if (allowedTypes.length && allowedTypes.indexOf(file.type) === -1) {
      errors.push('Invalid file type');
    }

    if (file.size > allowedSize * (1024 * 1024)) {
      errors.push('Incorrect file size');
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
