import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import { entities, entitiesPrefixes } from 'constants/uuid';
import PopoverButton from 'components/PopoverButton';
import Uuid from 'components/Uuid';

class Notes extends PureComponent {
  static propTypes = {
    notes: PropTypes.shape({
      content: PropTypes.arrayOf(PropTypes.shape({
        changedBy: PropTypes.string,
        targetUUID: PropTypes.string,
      })),
    }).isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
  };

  renderItem = item => (
    <PopoverButton
      className="d-block mb-2"
      key={item.noteId}
      id={`profile-pinned-note-${item.noteId}`}
      onClick={id => this.props.onEditNoteClick(
        id,
        item,
        {
          placement: 'bottom-start',
          hideArrow: true,
          className: 'notes-button__popover',
          id,
        },
      )}
    >
      <div className="note-content">
        <If condition={item.changedBy}>
          <div className="note-content__author">
            {I18n.t('COMMON.AUTHOR_BY')}
            <Uuid uuid={item.changedBy} uuidPrefix={entitiesPrefixes[entities.operator]} />
          </div>
        </If>
        <small>
          {
            item.changedAt
              ? moment.utc(item.changedAt).local().format('DD.MM.YYYY HH:mm:ss')
              : I18n.t('COMMON.UNKNOWN_TIME')
          } {I18n.t('COMMON.TO')} {this.renderItemId(item.targetUUID)}
        </small>
        <div className="note-content__subject">{item.subject}</div>
        <div className="note-content__content">{item.content}</div>
      </div>
    </PopoverButton>
  );

  renderItemId = (targetUUID) => {
    const [targetType] = targetUUID.split('-', 1);

    return <Uuid uuid={targetUUID} uuidPrefix={entitiesPrefixes[targetType]} />;
  };

  render() {
    const { notes } = this.props;

    return (
      <div className="account-details__pinned-notes">
        <span className="account-details__label">
          {I18n.t('LEAD_PROFILE.PINNED_NOTES.TITLE')}
        </span>
        <If condition={notes && notes.content}>
          <div className="card">
            <div className="card-body">
              {notes.content.map(this.renderItem)}
            </div>
          </div>
        </If>
      </div>
    );
  }
}

export default Notes;
