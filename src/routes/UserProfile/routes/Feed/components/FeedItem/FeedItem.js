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

class FeedItem extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    letterColor: PropTypes.oneOf(['green', 'blue', 'red']).isRequired,
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
      default:
        return null;
    }
  };

  render() {
    const { opened } = this.state;
    const {
      letter,
      letterColor,
      data,
    } = this.props;

    return (
      <div className="row feed-item">
        <div className="col-xs-1">
          <div className={`letter letter-${letterColor}`}>
            {letter}
          </div>
        </div>
        <div className="col-xs-11 padding-left-0">
          <div className="first-row">
            <span className="audit-name">{data.authorFullName}</span> - {shortify(data.authorUuid)}
            <span className="pull-right">{shortify(data.uuid)}</span>
          </div>
          <div className="date-time-ip">
            {data.creationDate ? moment(data.creationDate).format('YYYY-MM-DD HH:mm:ss') : null}
            {
              [types.PLAYER_LOG_IN, types.PLAYER_LOG_OUT].indexOf(data.type) === -1 && data.ip
                ? ` from ${data.ip}`
                : null
            }
          </div>
          <div className="padding-top-5">
            <span className={classNames('status', typesClassNames[data.type])}>
              {
                data.type && typesLabels[data.type]
                  ? typesLabels[data.type]
                  : data.type
              }
            </span>
            <button className="btn-transparent hide" onClick={this.handleToggleClick}>
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
