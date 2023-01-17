import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import EventEmitter, { NOTE_REMOVED } from 'utils/EventEmitter';
import NoteModal from 'components/NoteModal';
import Uuid from 'components/Uuid';
import { entities, entitiesPrefixes } from 'constants/uuid';
import ActionsDropDown from '../ActionsDropDown';
import RemoveNoteMutation from './graphql/RemoveNoteMutation';
import './NoteItem.scss';

class NoteItem extends PureComponent {
  static propTypes = {
    note: PropTypes.noteEntity.isRequired,
    removeNote: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      noteModal: PropTypes.modalType.isRequired,
    }).isRequired,
  };

  handleEditNote = () => {
    const {
      note,
      modals: { noteModal },
    } = this.props;

    noteModal.show({ note });
  };

  handleRemoveNote = async () => {
    const { note, removeNote } = this.props;

    try {
      await removeNote({ variables: { noteId: note.noteId } });

      EventEmitter.emit(NOTE_REMOVED, note);
    } catch (e) {
      // Do nothing...
    }
  };

  render() {
    const {
      note: {
        changedAt,
        changedBy,
        targetUUID,
        pinned,
        subject,
        content,
        operator,
      },
    } = this.props;

    const [targetType] = targetUUID.split('-', 1);

    return (
      <div className="NoteItem">
        <div className="NoteItem__content-wrapper">
          <Choose>
            <When condition={!!operator?.fullName}>
              <b>{operator.fullName}</b>
            </When>
            <Otherwise>
              <div>&mdash;</div>
            </Otherwise>
          </Choose>

          <div className="NoteItem__heading">
            <If condition={changedBy}>
              <Uuid uuid={changedBy} uuidPrefix={entitiesPrefixes[entities.operator]} />
            </If>
            <div className="NoteItem__edition-date">
              <Choose>
                <When condition={changedAt}>
                  {moment.utc(changedAt)
                    .local()
                    .format('DD.MM.YYYY HH:mm:ss')}
                </When>
                <Otherwise>
                  {I18n.t('COMMON.UNKNOWN_TIME')}
                </Otherwise>
              </Choose>
              <span className="mx-1">{I18n.t('COMMON.TO')}</span>
              <Uuid uuid={targetUUID} uuidPrefix={entitiesPrefixes[targetType]} />
            </div>
          </div>
          <div className="NoteItem__body-container">
            <div className="NoteItem__body">
              <If condition={subject}>
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
                  onClick: this.handleEditNote,
                  permission: permissions.NOTES.UPDATE_NOTE,
                },
                {
                  label: I18n.t('COMMON.ACTIONS.DELETE'),
                  onClick: this.handleRemoveNote,
                  permission: permissions.NOTES.DELETE_NOTE,
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withModals({
    noteModal: NoteModal,
  }),
  withRequests({
    removeNote: RemoveNoteMutation,
  }),
)(NoteItem);
