import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import classNames from 'classnames';
import { withPermission } from 'providers/PermissionsProvider';
import { FormikInputField, FormikSwitchField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { createValidator, translateLabels } from 'utils/validator';
import { entitiesPrefixes } from 'constants/uuid';
import PropTypes from 'constants/propTypes';
import Uuid from '../Uuid';
import {
  RemoveNoteMutation,
  UpdateNoteMutation,
  AddNoteMutation,
} from './graphql';
import './NotePopover.scss';

const MAX_CONTENT_LENGTH = 10000;

const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.BODY',
};

const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_CONTENT_LENGTH}`],
  pinned: ['required', 'boolean'],
}, translateLabels(attributeLabels), false);

const updateNotePermissions = new Permissions(permissions.NOTES.UPDATE_NOTE);
const deleteNotePermissions = new Permissions(permissions.NOTES.DELETE_NOTE);

class NotePopover extends PureComponent {
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
    addNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    removeNote: PropTypes.func.isRequired,
    defaultTitleLabel: PropTypes.string,
    initialValues: PropTypes.object.isRequired,
    targetType: PropTypes.string,
    toggle: PropTypes.func,
    hideArrow: PropTypes.bool,
    className: PropTypes.string,
    permission: PropTypes.permission.isRequired,
  };

  static defaultProps = {
    item: null,
    defaultTitleLabel: null,
    placement: 'bottom',
    isOpen: false,
    targetType: '',
    toggle: null,
    hideArrow: false,
    className: null,
    manual: false,
    onAddSuccess: () => {},
    onAddFailure: () => {},
    onUpdateSuccess: () => {},
    onUpdateFailure: () => {},
    onDeleteSuccess: () => {},
    onDeleteFailure: () => {},
  };

  state = {
    isDirty: false,
  };

  onSubmit = async (data) => {
    const { item, targetType } = this.props;

    if (item) {
      await this.handleUpdateNote(data);
    } else {
      await this.handleAddNote({ ...data, targetType });
    }
  };

  handleAddNote = async (currentValues) => {
    const {
      addNote,
      toggle,
      manual,
      onAddSuccess,
      onAddFailure,
      initialValues,
    } = this.props;

    // If manual request processing --> emit successful event
    if (manual) {
      onAddSuccess({ ...initialValues, ...currentValues });
      toggle();
    } else {
      const {
        data: {
          note: {
            add: {
              data,
              error,
            },
          },
        },
      } = await addNote({ variables: { ...initialValues, ...currentValues } });

      if (error) {
        onAddFailure(error);
      } else {
        onAddSuccess(data);
        toggle();
      }
    }
  };

  handleUpdateNote = async (currentValues) => {
    const {
      updateNote,
      toggle,
      manual,
      onUpdateSuccess,
      onUpdateFailure,
      initialValues,
    } = this.props;

    // If manual request processing --> emit successful event
    if (manual) {
      onUpdateSuccess({ ...initialValues, ...currentValues });
      toggle();
    } else {
      const {
        data: {
          note: {
            update: {
              error,
              data,
            },
          },
        },
      } = await updateNote({ variables: { ...initialValues, ...currentValues } });

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
    } = this.props;
    const { isDirty } = this.state;

    const shouldClose = isOpen && (ignoreChanges || !isDirty);

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
        <div className="NotePopover__title">
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
      <PopoverHeader tag="div" className="NotePopover__header">
        <div className="NotePopover__subtitle">
          {I18n.t('COMMON.LAST_CHANGED')}
        </div>
        <If condition={changedBy}>
          <div className="NotePopover__author">
            {I18n.t('COMMON.AUTHOR_BY')} {' '} <Uuid uuid={changedBy} className="font-weight-700" />
          </div>
        </If>
        <div className="row no-gutters NotePopover__subtitle">
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
              <Button
                onClick={() => this.handleRemoveNote(noteId || uuid)}
                className="NotePopover__delete-btn"
              >
                <i className="fa fa-trash color-danger" />
              </Button>
            </If>
          </div>
        </div>
      </PopoverHeader>
    );
  };

  setIsDirty = (dirty) => {
    this.setState({
      isDirty: dirty,
    });
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
      initialValues: {
        subject,
        content,
        pinned,
      },
      hideArrow,
      className,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const { isDirty } = this.state;

    const updateAllowed = updateNotePermissions.check(currentPermissions);

    return (
      <Popover
        placement={placement}
        isOpen={isOpen}
        toggle={() => this.handleHide()}
        target={target}
        className={classNames('NotePopover', className)}
        hideArrow={hideArrow}
      >
        <Formik
          initialValues={{
            subject,
            content,
            pinned,
          }}
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
                    disabled={item && !updateAllowed}
                  />
                  <Field
                    name="content"
                    label={I18n.t(attributeLabels.content)}
                    component={FormikTextAreaField}
                    showErrorMessage={false}
                    disabled={item && !updateAllowed}
                  />
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="font-size-11">
                        <span className="font-weight-700">
                          {values && values.content ? values.content.length : 0}
                        </span>/{MAX_CONTENT_LENGTH}
                      </div>
                      <If condition={!item || updateAllowed}>
                        <Field
                          name="pinned"
                          wrapperClassName="margin-top-5"
                          label={I18n.t(attributeLabels.pin)}
                          component={FormikSwitchField}
                        />
                      </If>
                    </div>
                    <div className="col text-right">
                      <Button
                        commonOutline
                        small
                        className="margin-right-10"
                        onClick={() => this.handleHide(true)}
                      >
                        {I18n.t('COMMON.BUTTONS.CANCEL')}
                      </Button>
                      <Choose>
                        <When condition={item && (item.uuid || item.noteId) && updateAllowed}>
                          <Button
                            type="submit"
                            primary
                            small
                            className="text-uppercase font-weight-700"
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
                            className="text-uppercase font-weight-700"
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
