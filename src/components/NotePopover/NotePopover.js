import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import ReactSwitch from '../../components/ReactSwitch';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { entitiesPrefixes } from '../../constants/uuid';
import './NotePopover.scss';
import Uuid from '../Uuid';
import { TextAreaField } from '../../components/ReduxForm';

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
      targetUUID: PropTypes.string,
    }),
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    toggle: PropTypes.func,
    hideArrow: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
  };
  static defaultProps = {
    item: null,
    defaultTitleLabel: I18n.t('COMMON.NOTE'),
    placement: 'bottom',
    isOpen: false,
    onSubmitSuccess: null,
    onSubmitFailure: null,
    onDeleteSuccess: null,
    onDeleteFailure: null,
    handleSubmit: null,
    currentValues: null,
    submitting: false,
    invalid: false,
    pristine: false,
    toggle: null,
    hideArrow: false,
    className: null,
    id: null,
  };

  handleHide = (ignoreChanges = false) => {
    const {
      isOpen,
      toggle,
      currentValues,
      item,
    } = this.props;

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

  handleDelete = (tagId) => {
    this.props.onDelete(tagId)
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

  renderSwitchField = ({ input, label, wrapperClassName, id }) => {
    const onClick = () => input.onChange(!input.value);

    return (
      <div className={wrapperClassName}>
        <ReactSwitch
          on={input.value}
          onClick={onClick}
          id={id}
        />
        <button type="button" className="note-popover__pin-label" onClick={onClick}>
          {label}
        </button>
      </div>
    );
  };

  renderTitle = () => {
    const { defaultTitleLabel, item } = this.props;

    if (!item) {
      return (
        <div className="note-popover__title">
          {defaultTitleLabel}
        </div>
      );
    }

    const {
      item: {
        tagId,
        uuid,
        lastEditionDate,
        creationDate,
        lastEditorUUID,
        targetUUID,
      },
    } = this.props;

    return (
      <PopoverHeader tag="div" className="note-popover__header">
        <If condition={lastEditionDate && creationDate}>
          <div className="note-popover__subtitle">
            <Choose>
              <When condition={lastEditionDate === creationDate}>
                {I18n.t('COMMON.CREATED')}
              </When>
              <Otherwise>
                {I18n.t('COMMON.LAST_CHANGED')}
              </Otherwise>
            </Choose>
          </div>
        </If>
        <If condition={lastEditorUUID}>
          <div className="note-popover__author">
            {I18n.t('COMMON.AUTHOR_BY')} {' '} <Uuid uuid={lastEditorUUID} className="font-weight-700" />
          </div>
        </If>
        <div className="row no-gutters note-popover__subtitle">
          <div className="col-auto">
            <If condition={lastEditionDate}>
              <Choose>
                <When condition={lastEditionDate}>
                  {moment.utc(lastEditionDate).local().format('DD.MM.YYYY HH:mm:ss')}
                </When>
                <Otherwise>
                  {I18n.t('COMMON.UNKNOWN_TIME')}
                </Otherwise>
              </Choose>
            </If>
            <If condition={targetUUID}>
              {' '} {I18n.t('COMMON.TO')} {this.renderItemId(targetUUID)}
            </If>
          </div>
          <div className="col-auto ml-auto">
            <button
              type="reset"
              onClick={() => this.handleDelete(tagId || uuid)}
              className="fa fa-trash color-danger note-popover__delete-btn"
            />
          </div>
        </div>
      </PopoverHeader>
    );
  };

  renderItemId = (targetUUID) => {
    const [targetType] = targetUUID.split('-', 1);

    return (
      <Uuid
        key={targetUUID}
        uuid={targetUUID}
        uuidPrefix={entitiesPrefixes[targetType]}
      />
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
      hideArrow,
      className,
      id,
    } = this.props;

    return (
      <Popover
        placement={placement}
        isOpen={isOpen}
        toggle={this.handleHide}
        target={target}
        className={classNames('note-popover', className)}
        hideArrow={hideArrow}
      >
        <PopoverBody tag="form" onSubmit={handleSubmit(onSubmit)}>
          {this.renderTitle()}
          <Field
            name="content"
            component={TextAreaField}
            showErrorMessage={false}
            id={id ? `${id}-textarea` : null}
          />
          <div className="row no-gutters align-items-center">
            <div className="col-auto">
              <div className="font-size-11">
                <span className="font-weight-700">
                  {currentValues && currentValues.content ? currentValues.content.length : 0}
                </span>/{MAX_CONTENT_LENGTH}
              </div>
              <Field
                name="pinned"
                wrapperClassName="margin-top-5"
                label="Pin"
                component={this.renderSwitchField}
                id={id ? `${id}-pin-btn` : null}
              />
            </div>
            <div className="col text-right">
              <button
                type="button"
                className="btn btn-default-outline btn-sm margin-right-10"
                onClick={() => this.handleHide(true)}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm text-uppercase font-weight-700"
                disabled={pristine || submitting || invalid}
              >
                <Choose>
                  <When condition={item && (item.uuid || item.tagId)}>
                    {I18n.t('COMMON.BUTTONS.UPDATE')}
                  </When>
                  <Otherwise>
                    {I18n.t('COMMON.BUTTONS.SAVE')}
                  </Otherwise>
                </Choose>
              </button>
            </div>
          </div>
        </PopoverBody>
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
