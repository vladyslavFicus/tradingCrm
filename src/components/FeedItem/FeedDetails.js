import React, { Component } from 'react';
import { pickBy } from 'lodash';
import PropTypes from 'prop-types';

class FeedDetails extends Component {
  static propTypes = {
    items: PropTypes.object,
    formatters: PropTypes.object,
    attributeLabels: PropTypes.object,
  };

  static defaultProps = {
    formatters: {},
    items: {},
    attributeLabels: {},
  };

  formatValue = (attribute, value) => {
    const { formatters } = this.props;

    return formatters[attribute]
      ? formatters[attribute].reduce((res, formatter) => formatter(res), value)
      : value;
  };

  render() {
    const { items, attributeLabels } = this.props;

    return (
      <div className="feed-item_info-details">
        {Object.keys(pickBy(items)).map(i => (
          <div key={i}>
            {attributeLabels[i] || i}: {' '}
            <span className="feed-item_info-details_value">
              {this.formatValue(i, items[i].toString())}
            </span>
          </div>
        ))}
      </div>
    );
  }
}

export default FeedDetails;
