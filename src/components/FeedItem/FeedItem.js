import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { size } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { types, typesLabels, typesClassNames } from 'constants/audit';
import LetterIcon from 'components/LetterIcon';
import formatLabel from 'utils/formatLabel';
import parseJson from 'utils/parseJson';
import FeedContent from './FeedContent';
import Uuid from '../Uuid';
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
      letter = authorFullName.split(' ').splice(0, 2).map(word => word[0]).join('');
    }

    return (
      <div className="FeedItem">
        <LetterIcon color={color} letter={letter} />
        <div className="FeedItem__content-wrapper">
          <div className="FeedItem__heading">
            <div className="row no-gutters">
              <div className={classNames('col FeedItem__status', typesClassNames[type])}>
                <Choose>
                  <When condition={type && typesLabels[type]}>
                    {I18n.t(typesLabels[type])}
                  </When>
                  <Otherwise>
                    {formatLabel(type)}
                  </Otherwise>
                </Choose>
              </div>
              <div className="col-auto pl-1 FeedItem__uuid">
                <Uuid uuid={uuid} />
              </div>
            </div>
            <div className="FeedItem__author">
              <span className={classNames('FeedItem__author-name', color)}>
                {authorFullName}
              </span>
              <If condition={authorUuid}>
                <span className="mx-1">-</span>
                <Uuid uuid={authorUuid} />
              </If>
            </div>
            <span className="FeedItem__creation-date">
              {moment.utc(creationDate).local().format('DD.MM.YYYY HH:mm:ss')}
              <If condition={[types.LOG_IN, types.LOG_OUT].indexOf(type) === -1 && ip}>
                <span className="mx-1">{I18n.t('COMMON.FROM')}</span>
                {ip}
              </If>
            </span>
            <If condition={hasInformation}>
              <button type="button" className="FeedItem__collapse" onClick={this.handleToggleClick}>
                {I18n.t(`COMMON.DETAILS_COLLAPSE.${opened ? 'HIDE' : 'SHOW'}`)}
                <i className={`fa fa-caret-${opened ? 'up' : 'down'}`} />
              </button>
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
