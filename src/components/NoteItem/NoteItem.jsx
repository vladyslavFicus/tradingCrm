import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import Uuid from '../Uuid';
import { entities, entitiesPrefixes } from '../../constants/uuid';
import { tagTypes } from '../../constants/tag';
import ActionsDropDown from '../ActionsDropDown';
import { modalType } from '../NoteModal/constants';
import './NoteItem.scss';

class NoteItem extends Component {
  static propTypes = {
    data: PropTypes.shape({
      changedBy: PropTypes.string,
      tagType: PropTypes.string,
      tagName: PropTypes.string,
      changedAt: PropTypes.string,
      targetUUID: PropTypes.string.isRequired,
      subject: PropTypes.string,
      content: PropTypes.string.isRequired,
      pinned: PropTypes.bool,
      operator: PropTypes.shape({
        fullName: PropTypes.string,
      }),
    }).isRequired,
    handleNoteClick: PropTypes.func.isRequired,
  };

  get content() {
    const { data: { tagType, content, tagName } } = this.props;

    return tagType === tagTypes.NOTE ? content : tagName;
  }

  render() {
    const {
      handleNoteClick,
      data,
      data: {
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
      <div className="note-item">
        <div className="note-item__content-wrapper">
          <b>{fullName}</b>
          <div className="note-item__heading">
            <If condition={changedBy}>
              <Uuid uuid={changedBy} uuidPrefix={entitiesPrefixes[entities.operator]} />
            </If>
            <div className="note-item__edition-date">
              <Choose>
                <When condition={changedAt}>
                  {moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm:ss')}
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
              <div className="note-item__body">
                <If condition={subject}>
                  <div className="note-item__subject">{subject}</div>
                </If>
                <div className="note-item__content">{content}</div>
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
                    onClick: handleNoteClick(modalType.EDIT, data),
                    permissions: new Permissions(permissions.NOTES.UPDATE_NOTE),
                  },
                  {
                    label: I18n.t('COMMON.ACTIONS.DELETE'),
                    onClick: handleNoteClick(modalType.DELETE, data),
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

export default NoteItem;
