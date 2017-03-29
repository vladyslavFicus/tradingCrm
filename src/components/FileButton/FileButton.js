import React, { Component, PropTypes } from 'react';

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
  };
  static defaultProps = {
    className: 'btn btn-primary',
    label: 'Upload file',
  };

  handleClick = (e) => {
    e.target.value = null;
  };

  handleChange = (e) => {
    const fileInput = e.target;
    const { onChosen } = this.props;

    onChosen(fileInput.value ? fileInput.files[0] : null);
  };

  render() {
    const { className, label } = this.props;

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
        />
        {label}
      </div>
    );
  }
}

export default FileUpload;
