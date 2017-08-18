import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './FileButton.scss';

class FileUpload extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    onChosen: PropTypes.func.isRequired,
    singleMode: PropTypes.bool,
  };
  static defaultProps = {
    label: 'Upload file',
    singleMode: true,
  };

  handleClick = (e) => {
    e.target.value = null;
  };

  handleChange = (e) => {
    const fileInput = e.target;
    const { onChosen, singleMode } = this.props;
    const files = fileInput.value ? fileInput.files : [];

    onChosen(singleMode ? files.item(0) : files);
  };

  render() {
    const { label, singleMode } = this.props;

    return (
      <label className="btn btn-default-outline btn-file">
        <input
          type="file"
          onClick={this.handleClick}
          onChange={this.handleChange}
          multiple={!singleMode}
        />
        {label}
      </label>
    );
  }
}

export default FileUpload;
