import React, { Component } from 'react';
import classNames from 'classnames';
import { size } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import LetterIcon from '../LetterIcon';
import { types, typesLabels, typesClassNames } from '../../constants/audit';
import FeedInfoAffiliateCreation from './FeedInfoAffiliateCreation';
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
import FeedInfoKYCChanged from './FeedInfoKYCChanged';
import FeedInfoKycConfirmation from './FeedInfoKycConfirmation';
import FeedInfoProfileBlocks from './FeedInfoProfileBlocks';
import FeedInfoRofusVerification from './FeedInfoRofusVerification';
import FeedInfoPlayerProfileStatusChanged from './FeedInfoPlayerProfileStatusChanged';
import FeedInfoTermsAccepted from './FeedInfoTermsAccepted';
import FeedProfileAssign from './FeedProfileAssign';
import FeedInfoChangeLeverageRequest from './FeedInfoChangeLeverageRequest';
import FeedProfileAcquissitionStatusChanged from './FeedProfileAcquissitionStatusChanged';
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
    this.setState(({ opened }) => ({ opened: !opened }));
  };

  renderInformation = (data) => {
    switch (data.type) {
      case types.AFFILIATE_ACCOUNT_CREATED:
        return <FeedInfoAffiliateCreation data={data} />;
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
      case types.PLAYER_PROFILE_KYC_CHANGED:
        return <FeedInfoKYCChanged data={data} />;
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
        return <FeedInfoKycConfirmation data={data} />;
      case types.ROFUS_VERIFICATION:
        return <FeedInfoRofusVerification data={data} />;
      case types.PLAYER_PROFILE_BLOCKED:
      case types.PLAYER_PROFILE_UNBLOCKED:
        return <FeedInfoProfileBlocks data={data} />;
      case types.PLAYER_PROFILE_SELF_EXCLUDED:
      case types.PLAYER_PROFILE_STATUS_CHANGED:
        return <FeedInfoPlayerProfileStatusChanged data={data} />;
      case types.PLAYER_PROFILE_SELF_EXCLUSION_COOLOFF:
        return <FeedInfoPlayerProfileStatusChanged data={data} />;
      case types.PLAYER_PROFILE_RESUMED:
        return <FeedInfoPlayerProfileStatusChanged data={data} />;
      case types.ACCEPTED_TERMS:
        return <FeedInfoTermsAccepted data={data} />;
      case types.PROFILE_ASSIGN:
        return <FeedProfileAssign data={data} />;
      case types.CHANGE_LEVERAGE_REQUESTED:
        return <FeedInfoChangeLeverageRequest data={data} />;
      case types.PLAYER_PROFILE_ACQUISITION_CHANGED:
        return <FeedProfileAcquissitionStatusChanged data={data} />;
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
        <LetterIcon color={color} letter={letter} />
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
                <Uuid uuid={uuid} />
              </div>
            </div>
            <div className="feed-item__author">
              <span className={classNames('feed-item__author-name', color)}>
                {authorFullName}
              </span>
              <If condition={authorUuid}>
                <span className="mx-1">-</span>
                <Uuid uuid={authorUuid} />
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
              <button type="button" className="feed-item__collapse" onClick={this.handleToggleClick}>
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
