import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../Uuid';
import PopoverButton from '../PopoverButton';
import { entities, entitiesPrefixes } from '../../constants/uuid';
import NoteIcon from '../NoteIcon';
import './NoteItem.scss';

const NoteItem = (props) => {
  const {
    data,
    data: {
      author,
      lastEditionDate,
      changedBy,
      targetUUID,
      content,
      pinned,
      tagId,
    },
    handleNoteClick,
  } = props;

  const [targetType] = targetUUID.split('-', 1);

  const letters = author ? author.split(' ').splice(0, 2).map(word => word[0]).join('') : null;

  return (
    <div className="note-item">
      <If condition={letters}>
        <div className="note-item__letters">
          {letters}
        </div>
      </If>
      <div className="note-item__content-wrapper">
        <div className="note-item__heading">
          <If condition={author}>
            <span className="note-item__author">
              {author}
            </span>
          </If>
          <If condition={changedBy}>
            <span className="mx-1">-</span>
            <Uuid uuid={changedBy} uuidPrefix={entitiesPrefixes[entities.operator]} />
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
              id={`note-item-${tagId}`}
              onClick={id => handleNoteClick(id, data)}
            >
              <NoteIcon type="filled" />
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
    changedBy: PropTypes.string,
    lastEditionDate: PropTypes.string,
    targetUUID: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    pinned: PropTypes.bool,
    tagId: PropTypes.string.isRequired,
  }).isRequired,
  handleNoteClick: PropTypes.func.isRequired,
};

export default NoteItem;
