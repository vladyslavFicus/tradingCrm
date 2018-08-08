import React, { Component } from 'react';
import classNames from 'classnames';
import { size } from 'lodash';
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
import FeedInfoProfileBlocked from './FeedInfoProfileBlocked';
import FeedInfoProfileUnblocked from './FeedInfoProfileUnblocked';
import FeedDetails from './FeedDetails';
import Uuid from '../Uuid';
import './FeedItem.scss';

class FeedItem extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['orange', 'blue']).isRequired,
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
      case types.KYC_CONFIRMATION:
      case types.ROFUS_VERIFICATION:
        return <FeedDetails items={data.details} />;
      case types.PLAYER_PROFILE_BLOCKED:
        return <FeedInfoProfileBlocked data={data} />;
      case types.PLAYER_PROFILE_UNBLOCKED:
        return <FeedInfoProfileUnblocked data={data} />;
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
      data: {
        details,
        type,
        uuid,
        authorFullName,
        authorUuid,
        creationDate,
        ip,
      },
    } = this.props;

    const hasInformation = size(details) > 0;

    return (
      <div className="feed-item">
        <div className={classNames('feed-item__letters', color)}>
          {letter}
        </div>
        <div className="feed-item__content-wrapper">
          <div className="feed-item__heading">
            <div className="row no-gutters">
              <div className={classNames('col feed-item__status', typesClassNames[type])}>
                <Choose>
                  <When condition={type && typesLabels[type]}>
                    {I18n.t(typesLabels[type])}
                  </When>
                  <Otherwise>
                    {type}
                  </Otherwise>
                </Choose>
              </div>
              <div className="col-auto pl-1 feed-item__uuid">
                {shortify(uuid)}
              </div>
            </div>
            <div className="feed-item__author">
              <span className={classNames('feed-item__author-name', color)}>
                {authorFullName}
              </span>
              <If condition={authorUuid}>
                <span className="mx-1">-</span>
                <Uuid
                  uuid={authorUuid}
                  uuidPrefix={
                    <Choose>
                      <When condition={authorUuid.indexOf('OPERATOR') === -1}>
                        OP
                      </When>
                      <When condition={authorUuid.indexOf('PLAYER') === -1}>
                        PL
                      </When>
                    </Choose>
                  }
                />
              </If>
            </div>
            <span className="feed-item__creation-date">
              {moment.utc(creationDate).local().format('DD.MM.YYYY HH:mm:ss')}
              <If condition={[types.LOG_IN, types.LOG_OUT].indexOf(type) === -1 && ip}>
                <span className="mx-1">{I18n.t('COMMON.FROM')}</span>
                {ip}
              </If>
            </span>
            <If condition={hasInformation}>
              <button className="feed-item__collapse" onClick={this.handleToggleClick}>
                {I18n.t(`COMMON.DETAILS_COLLAPSE.${opened ? 'HIDE' : 'SHOW'}`)}
                <i className={`fa fa-caret-${opened ? 'up' : 'down'}`} />
              </button>
            </If>
          </div>
          <If condition={hasInformation && opened}>
            <div className="feed-item__content">
              {this.renderInformation(data)}
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default FeedItem;
