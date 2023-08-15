import React, { useCallback } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import I18n from 'i18n-js';
import { Utils, Types, Constants } from '@crm/common';
import {
  Button,
  TrashButton,
  FormikInputField,
  FormikSwitchField,
  FormikTextAreaField,
} from 'components';
import Uuid from 'components/Uuid';
import useNotePopover from '../hooks/useNotePopover';
import './NotePopover.scss';

const MAX_CONTENT_LENGTH = 10000;

const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.BODY',
};

const validator = Utils.createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_CONTENT_LENGTH}`],
}, Utils.translateLabels(attributeLabels), false);

type Props = {
  note?: Types.NoteEntity | Types.ManualNote,
  placement?: Types.Placement,
  targetId: string,
  isOpen: boolean,
  isDirty: boolean,
  onSubmit: (formValues: Types.FormValues) => void,
  onClose: (ignoreChanges: boolean) => void,
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

  const {
    updateAllowed,
    deleteAllowed,
    handlePopoverClick,
  } = useNotePopover();

  // ===== Renders ===== //
  const renderItemId = useCallback(() => {
    if (!note?.targetUUID) {
      return null;
    }

    const [type] = note.targetUUID.split('-', 1);
    const uuidPrefix = Constants.entitiesPrefixes[type as Constants.entities];

    return (
      <>
        {' '} {I18n.t('COMMON.TO')} <Uuid key={note.targetUUID} uuid={note.targetUUID} uuidPrefix={uuidPrefix} />
      </>
    );
  }, [note]);

  const renderInfo = useCallback(() => {
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
  }, [note, renderItemId]);

  const renderTitle = useCallback(() => {
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
          <TrashButton
            onClick={onRemoveNote}
            data-testid="NotePopover-trashButton"
          />
        </If>
      </PopoverHeader>
    );
  }, [note, renderInfo, onRemoveNote, deleteAllowed]);

  // we should not render Popover component since it causes exception if target component is not rendered
  if (!isOpen) {
    return null;
  }

  return (
    <Popover
      target={targetId}
      isOpen={isOpen}
      placement={placement}
      toggle={() => onClose(false)}
      onClick={handlePopoverClick}
      className="NotePopover"
      popperClassName="NotePopover__popper"
      trigger="legacy"
      // @ts-ignore
      modifiers={[{
        name: 'preventOverflow',
        enabled: true,
        options: {
          altAxis: true,
          altBoundary: false,
          tether: false,
          rootBoundary: 'viewport',
          padding: 10,
        },
      }]}
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
                  data-testid="NotePopover-subjectInput"
                  label={I18n.t(attributeLabels.subject)}
                  component={FormikInputField}
                  disabled={note && !updateAllowed}
                />

                <Field
                  name="content"
                  data-testid="NotePopover-contentTextArea"
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
                        data-testid="NotePopover-pinnedSwitch"
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
                      data-testid="NotePopover-cancelButton"
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
                          data-testid="NotePopover-updateButton"
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
                          data-testid="NotePopover-saveButton"
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
