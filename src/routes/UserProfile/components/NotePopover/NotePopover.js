import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { createValidator } from 'utils/validator';
import ReactSwitch from 'react-toggle-switch';
import classNames from 'classnames';
import NotePopoverStyle from './NotePopover.scss';

const MAX_CONTENT_LENGTH = 500;
const FORM_NAME = 'notePopoverForm';
const notePopoverValuesSelector = formValueSelector(FORM_NAME);
const attributeLabels = {
  pinned: 'Pin',
  content: 'Content',
};
const validator = createValidator({
  content: ['required', 'string', `between:3,${MAX_CONTENT_LENGTH}`],
  pinned: ['required', 'boolean'],
}, attributeLabels, false);

class NotePopover extends Component {
  static propTypes = {
    item: PropTypes.object,
    isOpen: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    defaultTitleLabel: PropTypes.string,
  };

  static defaultProps = {
    defaultTitleLabel: 'Notes',
  };

  handleClick = () => {
    console.log('test');
  };

  render() {
    const {
      item,
      defaultTitleLabel,
      onSubmit,
      target,
      isOpen,
      handleSubmit,
      toggle,
      currentValues,
      submitting,
      invalid,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Popover
          cssModule={NotePopoverStyle}
          placement="bottom"
          isOpen={isOpen}
          toggle={toggle}
          target={target}
        >
          <PopoverTitle>
            {defaultTitleLabel}
          </PopoverTitle>
          <PopoverContent>
            <div className="row">
              <div className="col-md-12">
                <Field
                  name="content"
                  component={this.renderMessageField}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <span className="display-block color-default font-size-10">
                  {currentValues.content.length}/{MAX_CONTENT_LENGTH}
                </span>

                <Field
                  name="pinned"
                  wrapperClassName="display-block font-size-12"
                  label="Pin"
                  component={this.renderSwitchField}
                />
              </div>

              <div className="col-md-6 text-right">
                <button
                  className="btn btn-link btn-sm margin-inline"
                  onClick={toggle}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success btn-sm margin-inline"
                  disabled={submitting || invalid}
                >
                  Save
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </form>
    );
  }

  renderSwitchField = ({ input, label, wrapperClassName }) => {
    const onClick = () => input.onChange(!input.value);

    return <span className={wrapperClassName}>
      <ReactSwitch
        on={input.value}
        className="vertical-align-middle small-switch"
        onClick={onClick}
      />
      &nbsp;
      <span className="text-middle cursor-pointer" onClick={onClick}>{label}</span>
    </span>;
  };

  renderMessageField = ({ input, disabled, meta: { touched, error } }) => {
    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <textarea
          rows="3"
          {...input}
          className="form-control"
          disabled={disabled}
        />
      </div>
    );
  };
}

const NoteForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(NotePopover);

export default connect((state) => {
  return {
    currentValues: {
      content: notePopoverValuesSelector(state, 'content') || '',
      pinned: notePopoverValuesSelector(state, 'pinned') || false,
      targetType: notePopoverValuesSelector(state, 'targetType') || '',
      targetUUID: notePopoverValuesSelector(state, 'targetUUID') || '',
    },
  };
})(NoteForm);
