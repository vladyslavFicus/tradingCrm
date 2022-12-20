import React, { PureComponent } from 'react';
import { v4 } from 'uuid';
import compose from 'compose-function';
import { debounce } from 'lodash';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withPermission } from 'providers/PermissionsProvider';
import { FormikInputField, FormikSwitchField, FormikTextAreaField } from 'components/Formik';
import { Button, TrashButton } from 'components/UI';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import EventEmitter, { NOTE_ADDED, NOTE_UPDATED, NOTE_REMOVED } from 'utils/EventEmitter';
import { createValidator, translateLabels } from 'utils/validator';
import { entitiesPrefixes } from 'constants/uuid';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import {
  RemoveNoteMutation,
  UpdateNoteMutation,
  AddNoteMutation,
} from './graphql';
import './NotePopover.scss';

const MAX_CONTENT_LENGTH = 10000;

const INITIAL_VALUES = {
  subject: '',
  content: '',
  pinnned: false,
};

const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.BODY',
};

const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_CONTENT_LENGTH}`],
}, translateLabels(attributeLabels), false);

const updateNotePermissions = new Permissions(permissions.NOTES.UPDATE_NOTE);
const deleteNotePermissions = new Permissions(permissions.NOTES.DELETE_NOTE);

class NotePopover extends PureComponent {
  static propTypes = {
    note: PropTypes.noteEntity,
    placement: PropTypes.string,
    // Used for custom requests processing (will be emit on(*)Success event)
    manual: PropTypes.bool,
    onAddSuccess: PropTypes.func,
    onAddFailure: PropTypes.func,
    onUpdateSuccess: PropTypes.func,
    onUpdateFailure: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    onDeleteFailure: PropTypes.func,
    addNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    removeNote: PropTypes.func.isRequired,
    defaultTitleLabel: PropTypes.string,
    playerUUID: PropTypes.string.isRequired,
    targetUUID: PropTypes.string,
    targetType: PropTypes.string.isRequired,
    hideArrow: PropTypes.bool,
    className: PropTypes.string,
    permission: PropTypes.permission.isRequired,
    children: PropTypes.element,
  };

  static defaultProps = {
    targetUUID: null,
    note: null,
    defaultTitleLabel: null,
    placement: 'bottom',
    hideArrow: false,
    className: null,
    manual: false,
    onAddSuccess: () => {},
    onAddFailure: () => {},
    onUpdateSuccess: () => {},
    onUpdateFailure: () => {},
    onDeleteSuccess: () => {},
    onDeleteFailure: () => {},
    children: null,
  };

  id = `note-${v4()}`;

  state = {
    isOpen: false,
    isDirty: false,
  };

  onSubmit = async (data) => {
    const { note, targetUUID, targetType } = this.props;

    if (note) {
      await this.handleUpdateNote(data);
    } else {
      await this.handleAddNote({ ...data, targetUUID, targetType });
    }
  };

  handleAddNote = async (currentValues) => {
    const {
      addNote,
      manual,
      onAddSuccess,
      onAddFailure,
      playerUUID,
      targetUUID,
      targetType,
    } = this.props;

    const variables = { pinned: false, playerUUID, targetUUID, targetType, ...currentValues };

    // If manual request processing --> emit successful event
    if (manual) {
      onAddSuccess(variables);
      this.handleClose(true);
    } else {
      try {
        const {
          data: {
            note: {
              add: data,
            },
          },
        } = await addNote({ variables });

        onAddSuccess(data);
        EventEmitter.emit(NOTE_ADDED, data);

        this.handleClose(true);
      } catch (e) {
        onAddFailure(e);
      }
    }
  };

  handleUpdateNote = async (variables) => {
    const {
      updateNote,
      manual,
      onUpdateSuccess,
      onUpdateFailure,
    } = this.props;

    // If manual request processing --> emit successful event
    if (manual) {
      onUpdateSuccess(variables);
      this.handleClose(true);
    } else {
      try {
        const {
          data: {
            note: {
              update: data,
            },
          },
        } = await updateNote({ variables });

        onUpdateSuccess(data);
        EventEmitter.emit(NOTE_UPDATED, data);

        this.handleClose(true);
      } catch (e) {
        onUpdateFailure(e);
      }
    }
  };

  handleRemoveNote = async (noteId) => {
    const {
      note,
      removeNote,
      manual,
      onDeleteSuccess,
      onDeleteFailure,
    } = this.props;

    // If manual request processing --> emit successful event
    if (manual) {
      onDeleteSuccess(noteId);
      this.handleClose(true);
    } else {
      try {
        await removeNote({ variables: { noteId } });

        onDeleteSuccess(noteId);
        EventEmitter.emit(NOTE_REMOVED, note);

        this.handleClose(true);
      } catch (e) {
        onDeleteFailure(e);
      }
    }
  };

  handleOpen = (e) => {
    if (e) {
      e.stopPropagation();
    }

    this.setState({ isOpen: true });
  };

  handleClose = (ignoreChanges = false) => {
    const { isOpen, isDirty } = this.state;

    const shouldClose = isOpen && (ignoreChanges || !isDirty);

    if (shouldClose) {
      this.setState({ isOpen: false });
    }
  };

  handlePopoverClick = (e) => {
    e.stopPropagation();
  };

  renderTitle = () => {
    const {
      defaultTitleLabel,
      note,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const deleteAllowed = deleteNotePermissions.check(currentPermissions);

    if (!note) {
      return (
        <div className="NotePopover__title">
          {defaultTitleLabel || I18n.t('COMMON.NOTE')}
        </div>
      );
    }

    const {
      note: {
        noteId,
        uuid,
        changedAt,
        changedBy,
        targetUUID,
      },
    } = this.props;

    return (
      <PopoverHeader tag="div" className="NotePopover__header">
        <div className="NotePopover__subtitle">
          {I18n.t('COMMON.LAST_CHANGED')}
        </div>
        <If condition={changedBy}>
          <div className="NotePopover__author">
            {I18n.t('COMMON.AUTHOR_BY')} {' '} <Uuid uuid={changedBy} className="NotePopover__text-primary" />
          </div>
        </If>
        <div className="NotePopover__subtitle-container">
          <div>
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
          <div>
            <If condition={deleteAllowed}>
              <TrashButton onClick={() => this.handleRemoveNote(noteId || uuid)} />
            </If>
          </div>
        </div>
      </PopoverHeader>
    );
  };

  setIsDirty = debounce(dirty => this.setState({ isDirty: dirty }), 100);

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

  renderPopover = () => {
    const {
      note,
      placement,
      hideArrow,
      className,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const { isOpen, isDirty } = this.state;

    const updateAllowed = updateNotePermissions.check(currentPermissions);

    return (
      <Popover
        target={this.id}
        isOpen={isOpen}
        placement={placement}
        toggle={() => this.handleClose()}
        onClick={this.handlePopoverClick}
        className={classNames('NotePopover', className)}
        popperClassName={classNames('NotePopover__popper', className)}
        hideArrow={hideArrow}
        trigger="legacy"
        modifiers={[{
          name: 'preventOverflow',
          options: {
            altAxis: true,
            padding: 10,
          },
        }]}
      >
        <Formik
          initialValues={note || INITIAL_VALUES}
          validate={validator}
          onSubmit={this.onSubmit}
        >
          {({ isSubmitting, isValid, dirty, values }) => {
            if (dirty !== isDirty) {
              this.setIsDirty(dirty);
            }

            return (
              <Form>
                <PopoverBody>
                  {this.renderTitle()}
                  <Field
                    name="subject"
                    label={I18n.t(attributeLabels.subject)}
                    component={FormikInputField}
                    disabled={note && !updateAllowed}
                  />
                  <Field
                    name="content"
                    label={I18n.t(attributeLabels.content)}
                    component={FormikTextAreaField}
                    showErrorMessage={false}
                    maxLength={MAX_CONTENT_LENGTH}
                    disabled={note && !updateAllowed}
                  />
                  <div className="NotePopover__footer">
                    <div>
                      <div className="NotePopover__content-size">
                        <span className="NotePopover__text-primary">
                          {values && values.content ? values.content.length : 0}
                        </span>/{MAX_CONTENT_LENGTH}
                      </div>
                      <If condition={!note || updateAllowed}>
                        <Field
                          name="pinned"
                          label={I18n.t(attributeLabels.pin)}
                          component={FormikSwitchField}
                        />
                      </If>
                    </div>
                    <div>
                      <Button
                        tertiary
                        small
                        className="NotePopover__cancel-btn"
                        onClick={() => this.handleClose(true)}
                      >
                        {I18n.t('COMMON.BUTTONS.CANCEL')}
                      </Button>
                      <Choose>
                        <When condition={note && (note.uuid || note.noteId) && updateAllowed}>
                          <Button
                            type="submit"
                            primary
                            small
                            className="NotePopover__text-primary"
                            disabled={!dirty || isSubmitting || !isValid}
                          >
                            {I18n.t('COMMON.BUTTONS.UPDATE')}
                          </Button>
                        </When>
                        <Otherwise>
                          <Button
                            type="submit"
                            primary
                            small
                            className="NotePopover__text-primary"
                            disabled={!dirty || isSubmitting || !isValid}
                          >
                            {I18n.t('COMMON.BUTTONS.SAVE')}
                          </Button>
                        </Otherwise>
                      </Choose>
                    </div>
                  </div>
                </PopoverBody>
              </Form>
            );
          }}
        </Formik>
      </Popover>
    );
  };

  render() {
    const { children } = this.props;

    return (
      <If condition={children}>
        <>
          {React.cloneElement(children, { id: this.id, onClick: this.handleOpen })}
          {this.renderPopover()}
        </>
      </If>
    );
  }
}

export default compose(
  withPermission,
  withRequests({
    updateNote: UpdateNoteMutation,
    removeNote: RemoveNoteMutation,
    addNote: AddNoteMutation,
  }),
)(NotePopover);
