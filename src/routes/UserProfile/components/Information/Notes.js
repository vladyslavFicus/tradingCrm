import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { entities, entitiesPrefixes } from '../../../../constants/uuid';
import PopoverButton from '../../../../components/PopoverButton';
import Uuid from '../../../../components/Uuid';
import Card, { Content } from '../../../../components/Card';
import './Notes.scss';

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.shape({
      content: PropTypes.arrayOf(PropTypes.shape({
        author: PropTypes.string,
        lastEditorUUID: PropTypes.string,
        targetUUID: PropTypes.string,
      })),
    }).isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
  };

  renderItem = item => (
    <PopoverButton
      className="notes-button"
      key={item.uuid}
      id={`profile-pinned-note-${item.uuid}`}
      onClick={id => this.props.onEditNoteClick(
        id,
        item,
        {
          placement: 'bottom-start',
          hideArrow: true,
          className: 'notes-button__popover',
        }
      )}
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
              ? moment.utc(item.lastEditionDate).local().format('DD.MM.YYYY HH:mm:ss')
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
    const { notes } = this.props;

    return (
      <div className="account-details__pinned-notes">
        <span className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PINNED_NOTES.TITLE')}
        </span>
        <If condition={notes.content}>
          <Card>
            <Content>
              { notes.content.map(this.renderItem)}
            </Content>
          </Card>
        </If>
      </div>
    );
  }
}

export default Notes;
