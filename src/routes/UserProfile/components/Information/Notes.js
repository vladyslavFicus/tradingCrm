import React, { Component, PropTypes } from 'react';
import { entities, entitiesPrefixes } from 'constants/uuid';
import { shortify } from 'utils/uuid';
import NoteButton from '../NoteButton';
import moment from 'moment';

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

  render() {
    const { notes: { entities } } = this.props;

    return (
      <div className="player__account__details_notes col-md-4">
        <span className="player__account__details_notes-label">Pined note's</span>
        <div className="panel panel-with-borders">
          <div className="notes panel-body height-200">
            {entities.content.map(this.renderItem)}
          </div>
        </div>
      </div>
    );
  }

  renderItem = (item) => {
    return (
      <NoteButton
        className="display-block note panel panel-with-borders"
        key={item.uuid}
        id={`profile-pinned-note-${item.uuid}`}
        onClick={(id) => this.props.onEditNoteClick(id, item, { placement: 'left' })}

      >
        <div className="note-content panel-body panel-yellow">
          <span className="display-block color-secondary font-size-12">
            <span className="font-weight-700">Unknown operator</span>
            {' - '}
            {shortify(item.creatorUUID, entitiesPrefixes[entities.operator])}
          </span>
          <span className="display-block font-size-10 color-secondary">
          {
            item.creationDate
              ? moment(item.creationDate).format('DD.MM.YYYY HH:mm:ss')
              : 'Unknown time'
          } to {this.renderItemId(item)}
          </span>
          <i className="display-block font-size-14 margin-top-15">
            {item.content}
          </i>
        </div>
      </NoteButton>
    );
  };

  renderItemId = (item) => {
    return shortify(item.targetUUID, entitiesPrefixes[item.targetType]);
  };
}

export default Notes;
