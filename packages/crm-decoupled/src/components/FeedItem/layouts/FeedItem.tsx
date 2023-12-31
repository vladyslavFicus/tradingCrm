import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { Utils, Constants } from '@crm/common';
import { Button } from 'components';
import { Feed } from '__generated__/types';
import Uuid from 'components/Uuid';
import useFeedItem from 'components/FeedItem/hooks/useFeedItem';
import FeedDetails from './components/FeedDetails';
import './FeedItem.scss';

type Props ={
  data: Feed,
};

const FeedItem = (props: Props) => {
  const {
    data: {
      details,
      type,
      uuid,
      authorFullName,
      authorUuid,
      targetUuid,
      creationDate,
      ip,
    },
  } = props;

  const {
    hasInformation,
    author,
    letter,
    isOpen,
    parsedDetails,
    handleToggleClick,
  } = useFeedItem({ details, targetUuid, authorUuid, authorFullName });

  return (
    <div className="FeedItem">
      <div className={classNames('FeedItem__letters-icon', `FeedItem__letters-icon--${author}`)}>
        {letter}
      </div>

      <div className="FeedItem__content-wrapper">
        <div className="FeedItem__heading">
          <div className="FeedItem__title">
            <div className="FeedItem__status">
              <Choose>
                <When condition={!!type && !!Constants.auditTypesLabels[type]}>
                  {I18n.t(Constants.auditTypesLabels[type])}
                </When>

                <Otherwise>
                  {Utils.formatLabel(type)}
                </Otherwise>
              </Choose>
            </div>

            <div className="FeedItem__uuid">
              <Uuid uuid={uuid} />
            </div>
          </div>

          <div className="FeedItem__author">
            <span className={classNames('FeedItem__author-name', `FeedItem__author-name--${author}`)}>
              {authorFullName}
            </span>

            <If condition={!!authorUuid}>
              <span className="FeedItem__dash">-</span>&nbsp;
              <Uuid uuid={authorUuid} />
            </If>
          </div>

          <span className="FeedItem__creation-date">
            {moment.utc(creationDate).local().format('DD.MM.YYYY HH:mm:ss')}

            <If condition={[
              Constants.auditTypes.LOG_IN,
              Constants.auditTypes.LOG_OUT,
            ].includes(type as Constants.auditTypes) && !!ip}
            >
              <span className="FeedItem__creation-date-from">{I18n.t('COMMON.FROM')}</span>
              {ip}
            </If>
          </span>

          <If condition={hasInformation}>
            <Button
              className="FeedItem__collapse"
              onClick={handleToggleClick}
            >
              {I18n.t(`COMMON.DETAILS_COLLAPSE.${isOpen ? 'HIDE' : 'SHOW'}`)}
              <i className={`fa fa-caret-${isOpen ? 'up' : 'down'}`} />
            </Button>
          </If>
        </div>

        <If condition={hasInformation && isOpen}>
          <div className="FeedItem__content">
            <FeedDetails details={parsedDetails} />
          </div>
        </If>
      </div>
    </div>
  );
};

export default React.memo(FeedItem);
