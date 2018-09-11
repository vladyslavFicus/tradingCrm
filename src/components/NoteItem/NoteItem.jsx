import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Uuid from '../Uuid';
import PopoverButton from '../PopoverButton';
import { entities, entitiesPrefixes } from '../../constants/uuid';
import { tagTypeColors } from '../../constants/tag';
import NoteIcon from '../NoteIcon';
import MiniProfile from '../../components/MiniProfile';
import { types as miniProfileTypes } from '../../constants/miniProfile';
import './NoteItem.scss';

class NoteItem extends Component {
  static propTypes = {
    data: PropTypes.shape({
      changedBy: PropTypes.string,
      changedAt: PropTypes.string,
      targetUUID: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      pinned: PropTypes.bool,
      tagId: PropTypes.string.isRequired,
    }).isRequired,
    handleNoteClick: PropTypes.func.isRequired,
    fetchOperatorMiniProfile: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
  };

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
      data,
      data: {
        changedAt,
        changedBy,
        targetUUID,
        content,
        pinned,
        tagId,
        tagType,
      },
      handleNoteClick,
    } = this.props;

    const [targetType] = targetUUID.split('-', 1);

    return (
      <div className="note-item">
        <div className="note-item__content-wrapper">
          <div className="note-item__heading">
            <If condition={changedBy}>
              <span className={classNames(tagTypeColors[tagType], 'font-weight-700')}>
                {tagType}
              </span>
              <span className="mx-1">-</span>
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
  }
}

export default NoteItem;
