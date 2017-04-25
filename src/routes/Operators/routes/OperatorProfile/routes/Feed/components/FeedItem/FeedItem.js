import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import { shortify } from '../../../../../../../../utils/uuid';
import { types, typesLabels, typesClassNames } from '../../../../../../../../constants/audit';
import FeedInfoLogin from './FeedInfoLogin';
import FeedInfoLogout from './FeedInfoLogout';
import FeedInfoPlayerProfileSearch from './FeedInfoPlayerProfileSearch';
import './FeedItem.scss';

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
      case types.LOG_IN:
        return <FeedInfoLogin data={data} />;
      case types.LOG_OUT:
        return <FeedInfoLogout data={data} />;
      case types.PLAYER_PROFILE_SEARCH:
        return <FeedInfoPlayerProfileSearch data={data} />;
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
                ? typesLabels[data.type]
                : data.type
            }
            <span className="pull-right">{shortify(data.uuid)}</span>
          </div>
          <div className="feed-item_info-name">
            <span className={classNames('audit-name', color)}>
              {data.authorFullName}
            </span> - {shortify(data.authorUuid)}
          </div>
          <div className="feed-item_info-date">
            {data.creationDate ? moment(data.creationDate).format('DD.MM.YYYY HH:mm:ss') : null}
            {
              [types.LOG_IN, types.LOG_OUT].indexOf(data.type) === -1 && data.ip
                ? ` from ${data.ip}`
                : null
            }
            {
              hasInformation &&
              <button className="feed-item_info-date_btn-hide btn-transparent" onClick={this.handleToggleClick}>
                {
                  opened
                    ? <span>Hide details<i className="fa fa-caret-up" /></span>
                    : <span>Show details<i className="fa fa-caret-down" /></span>
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

