import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { actionCreators as authoritiesActionCreators } from '../../../../../../redux/modules/auth/authorities';
import { actionCreators as miniProfileActionCreators } from '../../../../../../redux/modules/miniProfile';
import { entities, entitiesPrefixes } from '../../../../../../constants/uuid';
import PopoverButton from '../../../../../../components/PopoverButton';
import Uuid from '../../../../../../components/Uuid';
import MiniProfile from '../../../../../../components/MiniProfile';
import { types as miniProfileTypes } from '../../../../../../constants/miniProfile';

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.shape({
      content: PropTypes.arrayOf(PropTypes.shape({
        changedBy: PropTypes.string,
        targetUUID: PropTypes.string,
      })),
    }).isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
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
            <MiniProfile
              target={item.changedBy}
              type={miniProfileTypes.OPERATOR}
              dataSource={this.handleLoadOperatorMiniProfile}
            >
              <Uuid uuid={item.changedBy} uuidPrefix={entitiesPrefixes[entities.operator]} />
            </MiniProfile>
          </div>
        </If>
        <small>
          {
            item.changedAt
              ? moment.utc(item.changedAt).local().format('DD.MM.YYYY HH:mm:ss')
              : I18n.t('COMMON.UNKNOWN_TIME')
          } {I18n.t('COMMON.TO')} {this.renderItemId(item.targetUUID)}
        </small>
        <div className="note-content__content">
          {item.content}
        </div>
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

const mapActions = {
  fetchOperatorMiniProfile: miniProfileActionCreators.fetchOperatorProfile,
  fetchAuthorities: authoritiesActionCreators.fetchAuthorities,
};

export default connect(null, mapActions)(Notes);
