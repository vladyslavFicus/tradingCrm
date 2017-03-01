import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { createValidator } from 'utils/validator';
import ReactSwitch from 'react-toggle-switch';
import classNames from 'classnames';
import moment from 'moment';
import { entities, entitiesPrefixes } from 'constants/uuid';
import { shortify } from 'utils/uuid';
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
    placement: PropTypes.string,
    isOpen: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    defaultTitleLabel: PropTypes.string,
  };

  static defaultProps = {
    defaultTitleLabel: 'Notes',
    placement: 'bottom',
  };

  render() {
    const {
      item,
      placement,
      onSubmit,
      target,
      isOpen,
      handleSubmit,
      toggle,
      currentValues,
      submitting,
      invalid,
      pristine,
    } = this.props;

    return (
      <Popover
        cssModule={NotePopoverStyle}
        placement={placement}
        isOpen={isOpen}
        toggle={toggle}
        target={target}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="popover-title">
            {this.renderTitle()}
          </div>
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
                  className="btn btn-success btn-sm margin-inline text-uppercase"
                  disabled={pristine || submitting || invalid}
                >
                  {item && item.uuid ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </PopoverContent>
        </form>
      </Popover>
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

  renderTitle = () => {
    const { defaultTitleLabel, item } = this.props;

    if (!item) {
      return defaultTitleLabel;
    }

    return <div>
      <span className="display-block color-secondary font-size-12">
            <span className="font-weight-700">Unknown operator</span>
        {' - '}
        {shortify(item.creatorUUID, entitiesPrefixes[entities.operator])}
          </span>
          <span className="display-block font-size-10 color-secondary">
          {
            item.creationDate
              ? moment(item.creationDate).format('DD.MM.YYYY HH:mm:ss')
              : 'Unknown time'
          } to {this.renderItemId(item)}
          </span>
    </div>
  };

  renderItemId = (item) => {
    return shortify(item.targetUUID, entitiesPrefixes[item.targetType]);
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
