import React, { Component } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import EventEmitter, { NOTE_REMOVED } from 'utils/EventEmitter';
import NoteModal from 'components/NoteModal';
import Uuid from 'components/Uuid';
import { entities, entitiesPrefixes } from 'constants/uuid';
import ActionsDropDown from '../ActionsDropDown';
import RemoveNoteMutation from './graphql/RemoveNoteMutation';
import './NoteItem.scss';

class NoteItem extends Component {
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
        operator: {
          fullName,
        },
      },
    } = this.props;

    const [targetType] = targetUUID.split('-', 1);

    return (
      <div className="NoteItem">
        <div className="NoteItem__content-wrapper">
          <b>{fullName}</b>
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
          <div className="row">
            <div className="col">
              <div className="NoteItem__body">
                <If condition={subject}>
                  <div className="NoteItem__subject">{subject}</div>
                </If>
                <div className="NoteItem__content">{content}</div>
                <If condition={pinned}>
                  <span className="note-item__pinned-note-badge">
                    {I18n.t('COMMON.PINNED')}
                  </span>
                </If>
              </div>
            </div>
            <div className="d-inline-block">
              <ActionsDropDown
                items={[
                  {
                    label: I18n.t('COMMON.ACTIONS.EDIT'),
                    onClick: this.handleEditNote,
                    permissions: new Permissions(permissions.NOTES.UPDATE_NOTE),
                  },
                  {
                    label: I18n.t('COMMON.ACTIONS.DELETE'),
                    onClick: this.handleRemoveNote,
                    permissions: new Permissions(permissions.NOTES.DELETE_NOTE),
                  },
                ]}
              />
            </div>
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
