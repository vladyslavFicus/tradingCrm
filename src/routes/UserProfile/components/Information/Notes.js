import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { entities, entitiesPrefixes } from '../../../../constants/uuid';
import { shortify } from '../../../../utils/uuid';
import PopoverButton from '../../../../components/PopoverButton';

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

  renderItem = (item) => {
    return (
      <PopoverButton
        className="display-block note panel"
        key={item.uuid}
        id={`profile-pinned-note-${item.uuid}`}
        onClick={id => this.props.onEditNoteClick(id, item, { placement: 'left' })}
      >
        <div className="note-content">
          <div className="font-size-13 line-height-1">
            {
              item.author &&
              <b>{`${item.author} - `}</b>
            }
            <span>
              {shortify(item.lastEditorUUID, entitiesPrefixes[entities.operator])}
            </span>
          </div>
          <small className="font-size-11">
            {
              item.lastEditionDate
                ? moment(item.lastEditionDate).format('DD.MM.YYYY HH:mm:ss')
                : 'Unknown time'
            } to {this.renderItemId(item)}
          </small>
          <div className="font-size-13 font-italic margin-top-5">
            {item.content}
          </div>
        </div>
      </PopoverButton>
    );
  };

  renderItemId = (item) => {
    return shortify(item.targetUUID, entitiesPrefixes[item.targetType]);
  };

  render() {
    const { notes: { entities: notesEntities } } = this.props;

    return (
      <div className="player__account__details_notes">
        <span className="player__account__details-label">Pined note's</span>
        <div className="panel">
          <div className="notes panel-body height-200">
            {notesEntities.content.map(this.renderItem)}
          </div>
        </div>
      </div>
    );
  }
}

export default Notes;
