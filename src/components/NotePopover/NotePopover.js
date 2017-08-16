import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverContent } from 'reactstrap';
import { reduxForm, Field, getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import ReactSwitch from '../../components/ReactSwitch';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { entitiesPrefixes } from '../../constants/uuid';
import NotePopoverStyle from './NotePopover.scss';
import Uuid from '../Uuid';

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
    isOpen: false,
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
        },
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
        },
      );
  };

  renderSwitchField = ({ input, label, wrapperClassName }) => {
    const onClick = () => input.onChange(!input.value);

    return (
      <span className={wrapperClassName}>
        <ReactSwitch
          on={input.value}
          className="vertical-align-middle"
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
      <div className="popover-title__container">
        {
          item.lastEditionDate && item.creationDate &&
          <div className="popover-title__label">
            {
              item.lastEditionDate === item.creationDate
                ? 'Created'
                : 'Last changed'
            }
          </div>
        }
        <div className="popover-title__author">
          by <span className="font-weight-700"><Uuid uuid={item.lastEditorUUID} /></span>
        </div>
        {
          item.lastEditionDate &&
          <div className="popover-title__date">
            {
              item.lastEditionDate
                ? moment(item.lastEditionDate).format('DD.MM.YYYY HH:mm:ss')
                : I18n.t('COMMON.UNKNOWN_TIME')
            } {I18n.t('COMMON.TO')} {!!item.targetUUID && this.renderItemId(item)}
            <button
              type="reset"
              onClick={() => this.handleDelete(item)}
              className="btn-transparent color-danger popover-title__trash-btn"
            >
              <i className="fa fa-trash" />
            </button>
          </div>
        }
      </div>
    );
  };

  renderItemId = item => <Uuid uuid={item.targetUUID} uuidPrefix={entitiesPrefixes[item.targetType]} />;

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
        className="note-popover"
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
              <div className="col-md-4">
                <div className="font-size-11">
                  <span className="font-weight-700">
                    {currentValues && currentValues.content ? currentValues.content.length : 0}
                  </span>/{MAX_CONTENT_LENGTH}
                </div>

                <Field
                  name="pinned"
                  wrapperClassName="display-block font-size-12 margin-top-5"
                  label="Pin"
                  component={this.renderSwitchField}
                />
              </div>

              <div className="col-md-8 text-right margin-top-10">
                <button
                  type="reset"
                  className="btn btn-default-outline btn-sm margin-right-10"
                  onClick={() => this.handleHide(true)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm text-uppercase font-weight-700"
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
