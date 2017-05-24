import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  fileInput: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    opacity: 0,
  },
  button: {
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1,
  },
};

class FileUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.any.isRequired,
    onChosen: PropTypes.func.isRequired,
    singleMode: PropTypes.bool,
  };
  static defaultProps = {
    className: 'btn btn-primary',
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
    const { className, label, singleMode } = this.props;

    return (
      <div
        className={className}
        style={styles.button}
      >
        <input
          type="file"
          style={styles.fileInput}
          onClick={this.handleClick}
          onChange={this.handleChange}
          multiple={!singleMode}
        />
        {label}
      </div>
    );
  }
}

export default FileUpload;
