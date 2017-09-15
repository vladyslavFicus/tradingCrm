import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';
import { types, typesLabels, typesClassNames } from '../../constants/audit';
import FeedInfoLogin from './FeedInfoLogin';
import FeedInfoLogout from './FeedInfoLogout';
import FeedInfoKyc from './FeedInfoKyc';
import FeedInfoPlayerProfileSearch from './FeedInfoPlayerProfileSearch';
import FeedInfoProfileChanged from './FeedInfoProfileChanged';
import FeedInfoProfileRegistered from './FeedInfoProfileRegistered';
import FeedInfoOperatorCreation from './FeedInfoOperatorCreation';
import FeedInfoPlayerProfileViewed from './FeedInfoPlayerProfileViewed';
import FeedInfoFailedLoginAttempt from './FeedInfoFailedLoginAttempt';
import FeedInfoKycRequest from './FeedInfoKycRequest';
import Uuid from '../Uuid';

class FeedItem extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['', 'orange', 'blue']).isRequired,
    data: PropTypes.auditEntity.isRequired,
  };
  state = {
    opened: false,
  };

  handleToggleClick = () => {
    this.setState({ opened: !this.state.opened });
  };

  renderInformation = (data) => {
    switch (data.type) {
      case types.LOG_IN:
        return <FeedInfoLogin data={data} />;
      case types.LOG_OUT:
        return <FeedInfoLogout data={data} />;
      case types.PLAYER_PROFILE_SEARCH:
        return <FeedInfoPlayerProfileSearch data={data} />;
      case types.KYC_ADDRESS_REFUSED:
      case types.KYC_ADDRESS_VERIFIED:
      case types.KYC_PERSONAL_REFUSED:
      case types.KYC_PERSONAL_VERIFIED:
        return <FeedInfoKyc data={data} />;
      case types.PLAYER_PROFILE_VERIFIED_EMAIL:
      case types.PLAYER_PROFILE_VERIFIED_PHONE:
      case types.PLAYER_PROFILE_CHANGED:
        return <FeedInfoProfileChanged data={data} />;
      case types.PLAYER_PROFILE_REGISTERED:
        return <FeedInfoProfileRegistered data={data} />;
      case types.NEW_OPERATOR_ACCOUNT_CREATED:
      case types.OPERATOR_ACCOUNT_CREATED:
        return <FeedInfoOperatorCreation data={data} />;
      case types.PLAYER_PROFILE_VIEWED:
        return <FeedInfoPlayerProfileViewed data={data} />;
      case types.FAILED_LOGIN_ATTEMPT:
        return <FeedInfoFailedLoginAttempt data={data} />;
      case types.KYC_REQUESTED:
        return <FeedInfoKycRequest data={data} />;
      default:
        return null;
    }
  };

  render() {
    const { opened } = this.state;
    const {
      letter,
      color,
      data,
    } = this.props;
    const hasInformation = Object.keys(data.details).length > 0;

    return (
      <div className="feed-item">
        <div className="feed-item_avatar">
          <div className={`feed-item_avatar-letter feed-item_avatar-letter_${color}`}>
            {letter}
          </div>
        </div>
        <div className="feed-item_info">
          <div className={classNames('feed-item_info-status', typesClassNames[data.type])}>
            {
              data.type && typesLabels[data.type]
                ? I18n.t(typesLabels[data.type])
                : data.type
            }
            <span className="pull-right">{shortify(data.uuid)}</span>
          </div>
          <div className="feed-item_info-name">
            <span className={classNames('audit-name', color)}>
              {data.authorFullName}
            </span>
            {
              !!data.authorUuid &&
              <span>
                {' - '}
                <Uuid
                  uuid={data.authorUuid}
                  uuidPrefix={
                    data.authorUuid.indexOf('OPERATOR') === -1
                      ? data.authorUuid.indexOf('PLAYER') === -1 ? 'PL' : null
                      : null
                  }
                />
              </span>
            }
          </div>
          <div className="feed-item_info-date">
            {data.creationDate ? moment.utc(data.creationDate).local().format('DD.MM.YYYY HH:mm:ss') : null}
            {
              [types.LOG_IN, types.LOG_OUT].indexOf(data.type) === -1 && data.ip
                ? ` ${I18n.t('COMMON.FROM')} ${data.ip}`
                : null
            }
            {
              hasInformation &&
              <button className="feed-item_info-date_btn-hide btn-transparent" onClick={this.handleToggleClick}>
                {
                  opened
                    ? (
                      <span>
                        {I18n.t('COMMON.DETAILS_COLLAPSE.HIDE')}
                        <i className="fa fa-caret-up" />
                      </span>
                    )
                    : (
                      <span>
                        {I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')}
                        <i className="fa fa-caret-down" />
                      </span>
                    )
                }
              </button>
            }
          </div>
          {hasInformation && opened && this.renderInformation(data)}
        </div>
      </div>
    );
  }
}

export default FeedItem;

