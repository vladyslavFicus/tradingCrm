import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { entitiesPrefixes } from '../../constants/uuid';
import './NotePopover.scss';
import Uuid from '../Uuid';
import { TextAreaField, SwitchField, InputField } from '../ReduxForm';

const MAX_CONTENT_LENGTH = 10000;
const FORM_NAME = 'notePopoverForm';
const attributeLabels = {
  pinned: 'Pin',
  content: 'Content',
};
const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_CONTENT_LENGTH}`],
  pinned: ['required', 'boolean'],
}, attributeLabels, false);

const updateNotePermissions = new Permissions(permissions.NOTES.UPDATE_NOTE);
const deleteNotePermissions = new Permissions(permissions.NOTES.DELETE_NOTE);

class NotePopover extends Component {
  static propTypes = {
    item: PropTypes.noteEntity,
    target: PropTypes.string.isRequired,
    placement: PropTypes.string,
    isOpen: PropTypes.bool,
    // Used for custom requests processing (will be emit on(*)Success event)
    manual: PropTypes.bool,

    onAddSuccess: PropTypes.func,
    onAddFailure: PropTypes.func,
    onUpdateSuccess: PropTypes.func,
    onUpdateFailure: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    onDeleteFailure: PropTypes.func,
    defaultTitleLabel: PropTypes.string,
    handleSubmit: PropTypes.func,
    currentValues: PropTypes.shape({
      pinned: PropTypes.bool,
      content: PropTypes.string,
      targetUUID: PropTypes.string,
      playerUUID: PropTypes.string,
    }),
    targetType: PropTypes.string,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    dirty: PropTypes.bool,
    toggle: PropTypes.func,
    hideArrow: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    permission: PropTypes.permission.isRequired,
  };

  static defaultProps = {
    item: null,
    defaultTitleLabel: null,
    placement: 'bottom',
    isOpen: false,
    handleSubmit: null,
    currentValues: null,
    targetType: '',
    submitting: false,
    invalid: false,
    pristine: false,
    dirty: false,
    toggle: null,
    hideArrow: false,
    className: null,
    id: null,
    manual: false,
    onAddSuccess: () => {},
    onAddFailure: () => {},
    onUpdateSuccess: () => {},
    onUpdateFailure: () => {},
    onDeleteSuccess: () => {},
    onDeleteFailure: () => {},
  };

  /**
   * Should return promise to resolve submitting property from redux-form
   * @param data
   * @return {Promise<void>}
   */
  onSubmit = async (data) => {
    const { item, targetType } = this.props;

    if (item) {
      await this.handleUpdateNote(data);
    } else {
      await this.handleAddNote({ ...data, targetType });
    }
  };

  handleAddNote = async (variables) => {
    const {
      addNote,
      toggle,
      manual,
      onAddSuccess,
      onAddFailure,
    } = this.props;

    // If manual request processing --> emit successful event
    if (manual) {
      onAddSuccess(variables);
      toggle();
    } else {
      const { data: { note: { add: { data, error } } } } = await addNote({ variables });

      if (error) {
        onAddFailure(error);
      } else {
        onAddSuccess(data);
        toggle();
      }
    }
  };

  handleUpdateNote = async (variables) => {
    const {
      updateNote,
      toggle,
      manual,
      onUpdateSuccess,
      onUpdateFailure,
    } = this.props;

    // If manual request processing --> emit successful event
    if (manual) {
      onUpdateSuccess(variables);
      toggle();
    } else {
      const { data: { note: { update: { data, error } } } } = await updateNote({ variables });

      if (error) {
        onUpdateFailure(error);
      } else {
        onUpdateSuccess(data);
        toggle();
      }
    }
  };

  handleRemoveNote = async (noteId) => {
    const {
      removeNote,
      toggle,
      manual,
      onDeleteSuccess,
      onDeleteFailure,
    } = this.props;

    // If manual request processing --> emit successful event
    if (manual) {
      onDeleteSuccess(noteId);
      toggle();
    } else {
      const { data: { note: { remove: { error } } } } = await removeNote({ variables: { noteId } });

      if (error) {
        onDeleteFailure(error);
      } else {
        onDeleteSuccess(noteId);
        toggle();
      }
    }
  };

  handleHide = (ignoreChanges = false) => {
    const {
      isOpen,
      toggle,
      dirty,
    } = this.props;

    const shouldClose = isOpen && (ignoreChanges || !dirty);

    if (shouldClose) {
      toggle();
    }
  };

  renderTitle = () => {
    const {
      defaultTitleLabel,
      item,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const deleteAllowed = deleteNotePermissions.check(currentPermissions);

    if (!item) {
      return (
        <div className="note-popover__title">
          {defaultTitleLabel || I18n.t('COMMON.NOTE')}
        </div>
      );
    }

    const {
      item: {
        noteId,
        uuid,
        changedAt,
        changedBy,
        targetUUID,
      },
    } = this.props;

    return (
      <PopoverHeader tag="div" className="note-popover__header">
        <div className="note-popover__subtitle">
          {I18n.t('COMMON.LAST_CHANGED')}
        </div>
        <If condition={changedBy}>
          <div className="note-popover__author">
            {I18n.t('COMMON.AUTHOR_BY')} {' '} <Uuid uuid={changedBy} className="font-weight-700" />
          </div>
        </If>
        <div className="row no-gutters note-popover__subtitle">
          <div className="col-auto">
            <If condition={changedAt}>
              <Choose>
                <When condition={changedAt}>
                  {moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm:ss')}
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
            <If condition={deleteAllowed}>
              <button
                type="button"
                onClick={() => this.handleRemoveNote(noteId || uuid)}
                className="fa fa-trash color-danger note-popover__delete-btn"
              />
            </If>
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
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const updateAllowed = updateNotePermissions.check(currentPermissions);

    return (
      <Popover
        placement={placement}
        isOpen={isOpen}
        toggle={() => this.handleHide()}
        target={target}
        className={classNames('note-popover', className)}
        hideArrow={hideArrow}
      >
        <PopoverBody tag="form" onSubmit={handleSubmit(this.onSubmit)}>
          {this.renderTitle()}
          <Field
            name="subject"
            id={id ? `${id}-input` : null}
            label={I18n.t('NOTES.SUBJECT')}
            placeholder=""
            type="text"
            component={InputField}
            showErrorMessage={false}
            disabled={item && !updateAllowed}
          />
          <Field
            name="content"
            id={id ? `${id}-textarea` : null}
            label={I18n.t('NOTES.BODY')}
            component={TextAreaField}
            showErrorMessage={false}
            disabled={item && !updateAllowed}
          />
          <div className="row no-gutters align-items-center">
            <div className="col-auto">
              <div className="font-size-11">
                <span className="font-weight-700">
                  {currentValues && currentValues.content ? currentValues.content.length : 0}
                </span>/{MAX_CONTENT_LENGTH}
              </div>
              <If condition={!item || updateAllowed}>
                <Field
                  name="pinned"
                  wrapperClassName="margin-top-5"
                  label={I18n.t('NOTES.MODAL.PIN')}
                  component={SwitchField}
                  id={id ? `${id}-pin-btn` : null}
                />
              </If>
            </div>
            <div className="col text-right">
              <button
                type="button"
                className="btn btn-default-outline btn-sm margin-right-10"
                onClick={() => this.handleHide(true)}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </button>
              <Choose>
                <When condition={item && (item.uuid || item.noteId) && updateAllowed}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm text-uppercase font-weight-700"
                    disabled={pristine || submitting || invalid}
                  >
                    {I18n.t('COMMON.BUTTONS.UPDATE')}
                  </button>
                </When>
                <Otherwise>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm text-uppercase font-weight-700"
                    disabled={pristine || submitting || invalid}
                  >
                    {I18n.t('COMMON.BUTTONS.SAVE')}
                  </button>
                </Otherwise>
              </Choose>
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
}))(withPermission(NoteForm));
