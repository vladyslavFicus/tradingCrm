import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverContent } from 'reactstrap';
import { reduxForm, Field, getFormValues } from 'redux-form';
import ReactSwitch from 'react-toggle-switch';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { entities, entitiesPrefixes } from '../../constants/uuid';
import { shortify } from '../../utils/uuid';
import NotePopoverStyle from './NotePopover.scss';

const MAX_CONTENT_LENGTH = 500;
const FORM_NAME = 'notePopoverForm';
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
    item: PropTypes.noteEntity,
    target: PropTypes.string.isRequired,
    placement: PropTypes.string,
    isOpen: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSubmitSuccess: PropTypes.func,
    onSubmitFailure: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    onDeleteFailure: PropTypes.func,
    defaultTitleLabel: PropTypes.string,
    handleSubmit: PropTypes.func,
    currentValues: PropTypes.shape({
      pinned: PropTypes.bool,
      content: PropTypes.string,
      targetType: PropTypes.string,
      targetUUID: PropTypes.string,
    }),
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    toggle: PropTypes.func,
  };
  static defaultProps = {
    defaultTitleLabel: 'Note',
    placement: 'bottom',
  };

  handleHide = (ignoreChanges = false) => {
    const { isOpen, toggle, currentValues, item } = this.props;
    const shouldClose = isOpen && (
        ignoreChanges || (
          !item
          || (
            currentValues && currentValues.content === item.content
            && currentValues && currentValues.pinned === item.pinned
          )
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

  renderSwitchField = ({ input, label, wrapperClassName }) => {
    const onClick = () => input.onChange(!input.value);

    return (
      <span className={wrapperClassName}>
        <ReactSwitch
          on={input.value}
          className="vertical-align-middle small-switch"
          onClick={onClick}
        />
        {' '}
        <button type="button" className="btn-transparent text-middle cursor-pointer" onClick={onClick}>
          {label}
        </button>
      </span>
    );
  };

  renderMessageField = ({ input, disabled, meta: { touched, error } }) => (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <textarea
        rows="3"
        {...input}
        className="form-control"
        disabled={disabled}
      />
    </div>
  );

  renderTitle = () => {
    const { defaultTitleLabel, item } = this.props;

    if (!item) {
      return defaultTitleLabel;
    }

    return (
      <div className="row">
        <div className="col-md-10">
          {
            item.lastEditionDate && item.creationDate &&
            <div className="color-secondary font-size-10">
              {
                item.lastEditionDate === item.creationDate
                  ? 'Created'
                  : 'Last changed'
              }
            </div>
          }
          <div className="color-secondary font-size-14 font-weight-700">
            by {shortify(item.lastEditorUUID, entitiesPrefixes[entities.operator])}
          </div>
          {
            item.lastEditionDate &&
            <div className="font-size-10 color-secondary">
              {
                item.lastEditionDate
                  ? moment(item.lastEditionDate).format('DD.MM.YYYY HH:mm:ss')
                  : 'Unknown time'
              } to {this.renderItemId(item)}
            </div>
          }
        </div>
        <div className="col-md-2 text-right">
          <button
            type="reset"
            onClick={() => this.handleDelete(item)}
            className="btn-transparent font-size-12 color-danger text-right"
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      </div>
    );
  };

  renderItemId = item => shortify(item.targetUUID, entitiesPrefixes[item.targetType]);

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
                <div className="color-default font-size-10">
                  {currentValues && currentValues.content ? currentValues.content.length : 0}/{MAX_CONTENT_LENGTH}
                </div>

                <Field
                  name="pinned"
                  wrapperClassName="display-block font-size-12 margin-top-10"
                  label="Pin"
                  component={this.renderSwitchField}
                />
              </div>

              <div className="col-md-6 text-right margin-top-10">
                <button
                  type="reset"
                  className="btn btn-link btn-sm"
                  onClick={() => this.handleHide(true)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success btn-sm text-uppercase"
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
}

const NoteForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(NotePopover);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(NoteForm);
