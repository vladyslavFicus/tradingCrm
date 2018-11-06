import React, { Component, Fragment } from 'react';
import { pickBy } from 'lodash';
import PropTypes from 'prop-types';
import renderLabel from '../../utils/renderLabel';

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
      Object.keys(pickBy(items)).map(i => (
        <Fragment key={i}>
          {renderLabel(i, attributeLabels)}:
          <span className="feed-item__content-value">
            {this.formatValue(i, items[i].toString())}
          </span>
          <br />
        </Fragment>
      ))
    );
  }
}

export default FeedDetails;
