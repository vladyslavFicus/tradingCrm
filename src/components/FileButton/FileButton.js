import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FileButton.scss';

class FileUpload extends Component {
  static propTypes = {
    label: PropTypes.any,
    onChosen: PropTypes.func.isRequired,
    singleMode: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    label: 'Upload file',
    singleMode: true,
    className: '',
  };

  handleClick = (e) => {
    e.target.value = null;
  };

  handleChange = ({ target: fileInput }) => {
    const { onChosen, singleMode } = this.props;
    const files = fileInput.value ? fileInput.files : [];

    onChosen(singleMode ? files.item(0) : files);
  };

  render() {
    const { label, singleMode, className } = this.props;

    return (
      <label className={classNames('btn btn-default-outline btn-file', className)}>
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
