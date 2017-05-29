import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import classNames from 'classnames';
import 'quill/dist/quill.snow.css';

class EditorField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { input, label, type, disabled, meta: { touched, error } } = this.props;

    return <div className={classNames('form-group row', { 'has-danger': touched && error })}>
      <div className="col-md-3">
        <label className="form-control-label">
          {label}
        </label>
      </div>
      <div className="col-md-9">
        <ReactQuill
          theme='snow'
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', { 'has-danger': touched && error })}
          placeholder={label}
        />
        {touched && error && <div className="form-control-feedback">
          {error}
        </div>}
      </div>
    </div>;
  }
}

EditorField.propTypes = {};

export default EditorField;
