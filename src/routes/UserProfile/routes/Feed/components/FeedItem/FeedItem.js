import React, { Component } from 'react';
import PropTypes from '../../../../../../constants/propTypes';
import { shortify } from '../../../../../../utils/uuid';
import { typesLabels, typesClassNames } from '../../../../../../constants/audit';
import './FeedItem.scss';

class FeedItem extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    letterColor: PropTypes.oneOf(['green', 'blue', 'red']).isRequired,
    data: PropTypes.auditEntity.isRequired,
  };

  render() {
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
            <span className="pull-right">AC-645j0941</span>
          </div>
          <div className="date-time-ip">2016-10-20 17:20:07 from 14.161.121.243</div>
          <div className="padding-top-5">
            <span className="status">KYC-Address-verified</span>
            <span className="hide">
              Hide details<i className="fa fa-caret-down" />
            </span>
            <i className="fa fa-sticky-note-o pull-right" />
          </div>
          <div className="information">
            <div>Country: <span className="information_value">Ukraine</span> - FI-213i8743</div>
            <div>City: <span className="information_value">Kiev</span></div>
            <div>Post-code: <span className="information_value">03126</span></div>
            <div>Country: <span className="information_value">Ukraine</span></div>
            <div className="rejection">
              <span className="rejection_heading">Rejection reason:</span>
              {' '}
              Sorry, but you`v
              sent us a very bad quality scan, we could not read any text on it. Please try to scan this document using
              another device.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeedItem;
