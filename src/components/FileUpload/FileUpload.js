import React, { Component, PropTypes } from 'react';
import FileButton from '../FileButton';

class FileUpload extends Component {
  static propTypes = {
    onChosen: PropTypes.func.isRequired,
    allowedSize: PropTypes.number,
    allowedTypes: PropTypes.array,
  };
  static defaultProps = {
    allowedSize: 2,
    allowedTypes: [],
    incorrectFileSize: 'Incorrect file size',
    invalidFileType: 'Invalid file type',
  };

  handleChoose = (file) => {
    const errors = this.validate(file);
    this.props.onChosen(errors, file);
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
