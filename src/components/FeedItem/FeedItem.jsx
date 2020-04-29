import React, { Component } from 'react';
import classNames from 'classnames';
import { size } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import LetterIcon from '../LetterIcon';
import { types, typesLabels, typesClassNames } from '../../constants/audit';
import FeedContent from './FeedContent';
import Uuid from '../Uuid';
import './FeedItem.scss';

class FeedItem extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['orange', 'blue', 'green']).isRequired,
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
      letter,
      color,
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
              <FeedContent details={details} />
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default FeedItem;
