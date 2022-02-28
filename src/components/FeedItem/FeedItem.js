import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { size } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { types, typesLabels, typesClassNames } from 'constants/audit';
import formatLabel from 'utils/formatLabel';
import parseJson from 'utils/parseJson';
import { Button } from 'components/UI';
import Uuid from '../Uuid';
import FeedContent from './FeedContent';
import './FeedItem.scss';

class FeedItem extends PureComponent {
  static propTypes = {
    data: PropTypes.auditEntity.isRequired,
  };

  state = {
    opened: false,
  };

  handleToggleClick = () => {
    this.setState(({ opened }) => ({ opened: !opened }));
  };

  render() {
    const { opened } = this.state;
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
    } = this.props;

    const parsedDetails = typeof details === 'string' ? parseJson(details) : details;
    const hasInformation = size(parsedDetails) > 0;

    let color = 'green';
    let letter = 's';

    if (authorUuid && authorFullName) {
      color = authorUuid === targetUuid ? 'blue' : 'orange';
      letter = authorFullName.split(' ').splice(0, 2).map(([word]) => word).join('');
    }

    return (
      <div className="FeedItem">
        <div className={classNames('FeedItem__letters-icon', color)}>
          {letter}
        </div>
        <div className="FeedItem__content-wrapper">
          <div className="FeedItem__heading">
            <div className="FeedItem__title">
              <div className={classNames('FeedItem__status', typesClassNames[type])}>
                <Choose>
                  <When condition={type && typesLabels[type]}>
                    {I18n.t(typesLabels[type])}
                  </When>
                  <Otherwise>
                    {formatLabel(type)}
                  </Otherwise>
                </Choose>
              </div>
              <div className="FeedItem__uuid">
                <Uuid uuid={uuid} />
              </div>
            </div>
            <div className="FeedItem__author">
              <span className={classNames('FeedItem__author-name', color)}>
                {authorFullName}
              </span>
              <If condition={authorUuid}>
                <span className="FeedItem__dash">-</span>
                <Uuid uuid={authorUuid} />
              </If>
            </div>
            <span className="FeedItem__creation-date">
              {moment.utc(creationDate).local().format('DD.MM.YYYY HH:mm:ss')}
              <If condition={[types.LOG_IN, types.LOG_OUT].includes(type) && ip}>
                <span className="FeedItem__creation-date-from">{I18n.t('COMMON.FROM')}</span>
                {ip}
              </If>
            </span>
            <If condition={hasInformation}>
              <Button
                className="FeedItem__collapse"
                onClick={this.handleToggleClick}
              >
                {I18n.t(`COMMON.DETAILS_COLLAPSE.${opened ? 'HIDE' : 'SHOW'}`)}
                <i className={`fa fa-caret-${opened ? 'up' : 'down'}`} />
              </Button>
            </If>
          </div>
          <If condition={hasInformation && opened}>
            <div className="FeedItem__content">
              <FeedContent details={parsedDetails} />
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default FeedItem;
