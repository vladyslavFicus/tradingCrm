import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../Uuid';
import PopoverButton from '../PopoverButton';
import { entities, entitiesPrefixes } from '../../constants/uuid';
import './NoteItem.scss';

const NoteItem = (props) => {
  const {
    data,
    data: {
      author,
      lastEditorUUID,
      lastEditionDate,
      targetUUID,
      targetType,
      content,
      pinned,
      uuid,
    },
    handleNoteClick,
  } = props;

  const letters = author.split(' ').splice(0, 2).map(word => word[0]).join('');

  return (
    <div className="note-item">
      <div className="note-item__letter">
        {letters}
      </div>
      <div className="note-item__content-wrapper">
        <div className="note-item__heading">
          <span className="note-item__author">
            {author}
          </span>
          <If condition={lastEditorUUID}>
            <span className="mx-1">-</span>
            <Uuid uuid={lastEditorUUID} uuidPrefix={entitiesPrefixes[entities.operator]} />
          </If>
          <div className="note-item__edition-date">
            <Choose>
              <When condition={lastEditionDate}>
                {moment.utc(lastEditionDate).local().format('DD.MM.YYYY HH:mm:ss')}
              </When>
              <Otherwise>
                {I18n.t('COMMON.UNKNOWN_TIME')}
              </Otherwise>
            </Choose>
            <span className="mx-1">{I18n.t('COMMON.TO')}</span>
            <Uuid uuid={targetUUID} uuidPrefix={entitiesPrefixes[targetType]} />
          </div>
        </div>
        <div className="row no-gutters note-item__body">
          <div className="col">
            <div className="note-item__content">
              {content}
            </div>
            <If condition={pinned}>
              <span className="note-item__pinned-note-badge">
                {I18n.t('COMMON.PINNED_NOTE')}
              </span>
            </If>
          </div>
          <div className="col-auto pl-1">
            <PopoverButton
              id={`note-item-${uuid}`}
              onClick={id => handleNoteClick(id, data)}
            >
              <i className="note-icon note-with-text" />
            </PopoverButton>
          </div>
        </div>
      </div>
    </div>
  );
};

NoteItem.propTypes = {
  data: PropTypes.shape({
    author: PropTypes.string,
    lastEditorUUID: PropTypes.string,
    lastEditionDate: PropTypes.string,
    targetUUID: PropTypes.string.isRequired,
    targetType: PropTypes.string.isRequired,
    content: PropTypes.any.isRequired,
    pinned: PropTypes.bool,
    uuid: PropTypes.string.isRequired,
  }).isRequired,
  handleNoteClick: PropTypes.func.isRequired,
};

export default NoteItem;
