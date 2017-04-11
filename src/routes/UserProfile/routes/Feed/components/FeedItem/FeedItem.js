import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import { shortify } from '../../../../../../utils/uuid';
import { types, typesLabels, typesClassNames } from '../../../../../../constants/audit';
import './FeedItem.scss';
import FeedInfoLogin from './FeedInfoLogin';
import FeedInfoLogout from './FeedInfoLogout';
import FeedInfoProfileChanged from './FeedInfoProfileChanged';
import FeedInfoProfileRegistered from './FeedInfoProfileRegistered';

class FeedItem extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['', 'orange', 'blue']),
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
      case types.PLAYER_LOG_IN:
        return <FeedInfoLogin data={data} />;
      case types.PLAYER_LOG_OUT:
        return <FeedInfoLogout data={data} />;
      case types.PLAYER_PROFILE_CHANGED:
        return <FeedInfoProfileChanged data={data} />;
      case types.PLAYER_PROFILE_REGISTERED:
        return <FeedInfoProfileRegistered data={data} />;
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
                ? typesLabels[data.type]
                : data.type
            }
            <span className="pull-right">{shortify(data.uuid)}</span>
          </div>
          <div className="feed-item_info-name">
            <span className={classNames('audit-name', color)}>
              {data.authorFullName}
            </span> - {shortify(data.authorUuid, data.authorUuid === data.targetUuid ? 'PL' : null)}
          </div>
          <div className="feed-item_info-date">
            {data.creationDate ? moment(data.creationDate).format('YYYY-MM-DD HH:mm:ss') : null}
            {
              [types.PLAYER_LOG_IN, types.PLAYER_LOG_OUT].indexOf(data.type) === -1 && data.ip
                ? ` from ${data.ip}`
                : null
            }
            <button className="feed-item_info-date_btn-hide btn-transparent" onClick={this.handleToggleClick}>
              {
                opened
                  ? <span>Hide details<i className="fa fa-caret-up" /></span>
                  : <span>Show details<i className="fa fa-caret-down" /></span>
              }
            </button>
          </div>
          {opened && this.renderInformation(data)}
        </div>
      </div>
    );
  }
}

export default FeedItem;

