import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { departments } from 'constants/brands';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import Uuid from '../Uuid';
import { entities, entitiesPrefixes } from '../../constants/uuid';
import { tagTypes } from '../../constants/tag';
import ActionsDropDown from '../ActionsDropDown';
import MiniProfile from '../../components/MiniProfile';
import { types as miniProfileTypes } from '../../constants/miniProfile';
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
    fetchOperatorMiniProfile: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
    department: PropTypes.string,
  };

  static defaultProps = {
    department: null,
  };

  get content() {
    const { data: { tagType, content, tagName } } = this.props;

    return tagType === tagTypes.NOTE ? content : tagName;
  }

  handleLoadOperatorMiniProfile = async (uuid) => {
    const { fetchOperatorMiniProfile, fetchAuthorities } = this.props;

    const action = await fetchOperatorMiniProfile(uuid);

    if (!action || action.error) {
      return {
        error: true,
        payload: action ? action.payload : null,
      };
    }

    const payload = { ...action.payload };

    const authoritiesAction = await fetchAuthorities(uuid);

    if (!authoritiesAction || authoritiesAction.error) {
      return {
        error: true,
        payload: authoritiesAction ? authoritiesAction.payload : null,
      };
    }

    payload.authorities = authoritiesAction.payload;

    return {
      error: false,
      payload,
    };
  };

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
              <MiniProfile
                target={changedBy}
                type={miniProfileTypes.OPERATOR}
                dataSource={this.handleLoadOperatorMiniProfile}
              >
                <Uuid uuid={changedBy} uuidPrefix={entitiesPrefixes[entities.operator]} />
              </MiniProfile>
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
                  permissions: new Permissions(permissions.TAGS.NOTES.UPDATE_NOTE),
                },
                {
                  label: I18n.t('COMMON.ACTIONS.DELETE'),
                  onClick: handleNoteClick(modalType.DELETE, data),
                  ...(department && { visible: department !== departments.CS }),
                  permissions: new Permissions(permissions.TAGS.NOTES.DELETE_NOTE),
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
