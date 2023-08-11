import React, { useCallback } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Config, Types } from '@crm/common';
import ActionsDropDown from 'components/ActionsDropDown';
import Uuid from 'components/Uuid';
import { entities, entitiesPrefixes } from 'constants/uuid';
import useNoteItem from '../hooks/useNoteItem';
import './NoteItem.scss';

type Props = {
  note: Types.Note,
};

const NoteItem = (props: Props) => {
  const { note } = props;

  const {
    handleEditNote,
    handleRemoveNote,
  } = useNoteItem({ note });

  // ===== Renders ===== //
  const renderItemId = useCallback((noteTargetUUID: string) => {
    const [type] = noteTargetUUID.split('-', 1);
    const uuidPrefix = entitiesPrefixes[type as entities];

    return (
      <Uuid uuid={noteTargetUUID} uuidPrefix={uuidPrefix} />
    );
  }, []);

  const {
    changedAt,
    changedBy,
    targetUUID,
    pinned,
    subject,
    content,
    operator,
  } = note;

  return (
    <div className="NoteItem">
      <div className="NoteItem__content-wrapper">
        <Choose>
          <When condition={!!operator?.fullName}>
            <b>{operator?.fullName}</b>
          </When>

          <Otherwise>
            &mdash;
          </Otherwise>
        </Choose>

        <div className="NoteItem__heading">
          <If condition={!!changedBy}>
            <Uuid uuid={changedBy} uuidPrefix={entitiesPrefixes[entities.OPERATOR]} />
          </If>

          <div className="NoteItem__edition-date">
            <Choose>
              <When condition={!!changedAt}>
                {moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm:ss')}
              </When>

              <Otherwise>
                {I18n.t('COMMON.UNKNOWN_TIME')}
              </Otherwise>
            </Choose>

            {' '} {I18n.t('COMMON.TO')} {renderItemId(targetUUID)}
          </div>
        </div>

        <div className="NoteItem__body-container">
          <div className="NoteItem__body">
            <If condition={!!subject}>
              <div className="NoteItem__subject">{subject}</div>
            </If>

            <div className="NoteItem__content">{content}</div>

            <If condition={pinned}>
              <span className="NoteItem__pinned-note-badge">
                {I18n.t('COMMON.PINNED')}
              </span>
            </If>
          </div>

          <ActionsDropDown
            items={[
              {
                label: I18n.t('COMMON.ACTIONS.EDIT'),
                onClick: handleEditNote,
                permission: Config.permissions.NOTES.UPDATE_NOTE,
              },
              {
                label: I18n.t('COMMON.ACTIONS.DELETE'),
                onClick: handleRemoveNote,
                permission: Config.permissions.NOTES.DELETE_NOTE,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoteItem);
