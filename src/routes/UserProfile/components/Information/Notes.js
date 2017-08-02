import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { entities, entitiesPrefixes } from '../../../../constants/uuid';
import PopoverButton from '../../../../components/PopoverButton';
import Uuid from '../../../../components/Uuid';

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.shape({
      entities: PropTypes.shape({
        content: PropTypes.array,
      }),
      isLoading: PropTypes.bool,
    }),
    onEditNoteClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    notes: { entities: { content: [] }, isLoading: false },
  };

  renderItem = item => (
    <PopoverButton
      className="panel"
      key={item.uuid}
      id={`profile-pinned-note-${item.uuid}`}
      onClick={id => this.props.onEditNoteClick(id, item, { placement: 'left' })}
    >
      <div className="note-content">
        <div className="note-content__author">
          {
            item.author &&
              <strong>{`${item.author} - `}</strong>
          }
          <span>
            <Uuid uuid={item.lastEditorUUID} uuidPrefix={entitiesPrefixes[entities.operator]} />
          </span>
        </div>
        <small>
          {
            item.lastEditionDate
              ? moment(item.lastEditionDate).format('DD.MM.YYYY HH:mm:ss')
              : I18n.t('COMMON.UNKNOWN_TIME')
          } {I18n.t('COMMON.TO')} {this.renderItemId(item)}
        </small>
        <div className="note-content__content">
          {item.content}
        </div>
      </div>
    </PopoverButton>
  );

  renderItemId = item => <Uuid uuid={item.targetUUID} uuidPrefix={entitiesPrefixes[item.targetType]} />;

  render() {
    const { notes: { entities: notesEntities } } = this.props;

    return (
      <div className="account-details__pinned-notes">
        <span className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PINNED_NOTES.TITLE')}
        </span>
        <div className="panel">
          <div className="panel-body">
            {notesEntities.content.map(this.renderItem)}
          </div>
        </div>
      </div>
    );
  }
}

export default Notes;
