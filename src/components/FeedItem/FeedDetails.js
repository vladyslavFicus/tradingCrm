import React, { Component, Fragment } from 'react';
import { pickBy, isPlainObject } from 'lodash';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
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

  renderItem = (item, value, attributeLabels) => {
    if (isPlainObject(value)) {
      return Object.keys(pickBy(value)).map(key => (
        <div className="feed-item__content-item" key={key}>
          {I18n.t(renderLabel(key, attributeLabels))}:
          {this.renderItem(key, value[key])}
          <br />
        </div>
      ));
    }

    return (
      <span className="feed-item__content-value">
        {this.formatValue(item, value.toString())}
      </span>
    );
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
      Object.keys(pickBy(items)).map(key => (
        <Fragment key={key}>
          {I18n.t(renderLabel(key, attributeLabels))}:
          {this.renderItem(key, items[key], attributeLabels)}
          <br />
        </Fragment>
      ))
    );
  }
}

export default FeedDetails;
