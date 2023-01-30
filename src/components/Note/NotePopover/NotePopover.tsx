import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import I18n from 'i18n-js';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { FormikInputField, FormikSwitchField, FormikTextAreaField } from 'components/Formik';
import { Button, TrashButton } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import { entitiesPrefixes, entities } from 'constants/uuid';
import Uuid from 'components/Uuid';
import { FormValues, NoteEntity, ManualNote, Placement } from 'types/Note';
// import './NotePopover.scss';

const MAX_CONTENT_LENGTH = 10000;

const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.BODY',
};

const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_CONTENT_LENGTH}`],
}, translateLabels(attributeLabels), false);

type Props = {
  note?: NoteEntity | ManualNote,
  placement?: Placement,
  targetId: string,
  isOpen: boolean,
  isDirty: boolean,
  onSubmit: (formValues: FormValues) => void,
  onClose: (ignoreChanges?: boolean) => void,
  onRemoveNote: () => void,
  onSetDirty: (dirty: boolean) => void,
};

const NotePopover = (props: Props) => {
  const {
    note,
    placement,
    targetId,
    isOpen,
    isDirty,
    onSubmit,
    onClose,
    onRemoveNote,
    onSetDirty,
  } = props;

  const permission = usePermission();

  const updateAllowed = permission.allows(permissions.NOTES.UPDATE_NOTE);
  const deleteAllowed = permission.allows(permissions.NOTES.DELETE_NOTE);

  // ===== Handlers ===== //
  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // ===== Renders ===== //
  const renderItemId = () => {
    if (!note?.targetUUID) {
      return null;
    }

    const [type] = note.targetUUID.split('-', 1);
    const uuidPrefix = entitiesPrefixes[type as entities];

    return (
      <>
        {' '} {I18n.t('COMMON.TO')} <Uuid key={note.targetUUID} uuid={note.targetUUID} uuidPrefix={uuidPrefix} />
      </>
    );
  };

  const renderInfo = () => {
    if (!note || !('noteId' in note)) {
      return null;
    }

    return (
      <>
        <div className="NotePopover__subtitle">
          {I18n.t('COMMON.LAST_CHANGED')}
        </div>

        <If condition={!!note.changedBy}>
          <div className="NotePopover__author">
            {I18n.t('COMMON.AUTHOR_BY')}
            {' '}
            <Uuid uuid={note.changedBy} className="NotePopover__text-primary" />
          </div>
        </If>

        <div className="NotePopover__subtitle-container">
          <Choose>
            <When condition={!!note.changedAt}>
              {moment.utc(note.changedAt).local().format('DD.MM.YYYY HH:mm:ss')}
            </When>

            <Otherwise>
              {I18n.t('COMMON.UNKNOWN_TIME')}
            </Otherwise>
          </Choose>

          {renderItemId()}
        </div>
      </>
    );
  };

  const renderTitle = () => {
    if (!note) {
      return (
        <div className="NotePopover__title">
          {I18n.t('COMMON.NOTE')}
        </div>
      );
    }

    return (
      <PopoverHeader tag="div" className="NotePopover__header">
        <div className="NotePopover__note-info">
          {renderInfo()}
        </div>

        <If condition={deleteAllowed}>
          <TrashButton onClick={onRemoveNote} />
        </If>
      </PopoverHeader>
    );
  };

  return (
    <Popover
      target={targetId}
      isOpen={isOpen}
      placement={placement}
      toggle={onClose}
      onClick={handlePopoverClick}
      className="NotePopover"
      popperClassName="NotePopover__popper"
      trigger="legacy"
    >
      <Formik
        initialValues={{
          content: note?.content || '',
          subject: note?.subject || '',
          pinned: note?.pinned || false,
        }}
        validate={validator}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, dirty, values }) => {
          if (dirty !== isDirty) {
            onSetDirty(dirty);
          }

          return (
            <Form>
              <PopoverBody>
                {renderTitle()}

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
                      onClick={() => onClose(true)}
                    >
                      {I18n.t('COMMON.BUTTONS.CANCEL')}
                    </Button>

                    <Choose>
                      <When condition={!!note && updateAllowed}>
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

export default React.memo(NotePopover);
