import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import { departments } from 'constants/brands';
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
      changedAt: PropTypes.string,
      targetUUID: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      pinned: PropTypes.bool,
    }).isRequired,
    handleNoteClick: PropTypes.func.isRequired,
    department: PropTypes.string,
  };

  static defaultProps = {
    department: null,
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
        content,
        operator: {
          fullName,
        },
      },
      department,
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
                <div className="note-item__content">
                  {content}
                </div>
                <If condition={pinned}>
                  <span className="note-item__pinned-note-badge">
                    {I18n.t('COMMON.PINNED')}
                  </span>
                </If>
              </div>
            </div>
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
                  ...(department && { visible: department !== departments.CS }),
                  permissions: new Permissions(permissions.NOTES.DELETE_NOTE),
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default NoteItem;
