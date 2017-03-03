import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverContent } from 'reactstrap';
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
    onSubmitSuccess: PropTypes.func,
    onSubmitFailure: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    onDeleteFailure: PropTypes.func,
    defaultTitleLabel: PropTypes.string,
  };
  static defaultProps = {
    defaultTitleLabel: 'Notes',
    placement: 'bottom',
  };

  handleHide = (ignoreChanges = false) => {
    const { isOpen, toggle, currentValues, item } = this.props;
    const shouldClose = isOpen && (
        ignoreChanges || (
          !item
          || currentValues.content === item.content
          && currentValues.pinned === item.pinned
        )
      );

    if (shouldClose) {
      toggle();
    }
  };

  handleSubmit = (data) => {
    this.props.onSubmit(data)
      .then(
        () => {
          if (typeof this.props.onSubmitSuccess === 'function') {
            this.props.onSubmitSuccess();
          }
        },
        () => {
          if (typeof this.props.onSubmitFailure === 'function') {
            this.props.onSubmitFailure();
          }
        }
      );
  };

  handleDelete = (item) => {
    this.props.onDelete(item)
      .then(
        () => {
          if (typeof this.props.onSubmitSuccess === 'function') {
            this.props.onDeleteSuccess();
          }
        },
        () => {
          if (typeof this.props.onSubmitFailure === 'function') {
            this.props.onDeleteFailure();
          }
        }
      );
  };

  render() {
    const {
      item,
      placement,
      onSubmit,
      target,
      isOpen,
      handleSubmit,
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
        toggle={this.handleHide}
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
                  onClick={() => this.handleHide(true)}
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
      {' '}
      <span className="text-middle cursor-pointer" onClick={onClick}>
        {label}
      </span>
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

    return <div className="row">
      <div className="col-md-10">
        <span className="display-block color-secondary font-size-14 font-weight-700">
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
      <div className="col-md-2 text-right">
        <span onClick={() => this.handleDelete(item)} className="font-size-12 color-danger text-right">
          <i className="fa fa-trash"/>
        </span>
      </div>
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
