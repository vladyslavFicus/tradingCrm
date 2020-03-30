import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { isObject } from 'lodash';
import PropTypes from 'constants/propTypes';
import { attributeLabels } from 'constants/user';
import { prepareValue } from './utils';
import './FeedContent.scss';

class FeedContent extends PureComponent {
  static propTypes = {
    details: PropTypes.object.isRequired,
  };

  // define details as mixed(outdated with newest) or newest and handle them
  handleFeedDetails = (details, acc) => {
    // eslint-disable-next-line no-unused-expressions
    details.changeType
      ? this.handleNewestDetails(details, acc)
      : this.handleMixedDetails(details, acc);
  };

  handleMixedDetails = (details, acc) => {
    Object.entries(details).forEach(([detailKey, detailValue]) => {
      // for nested objects or updated feeds
      if (isObject(detailValue)) {
        const { value, changeType, from, to } = detailValue;

        switch (changeType) {
          case 'ADDED': {
            acc.push(
              <div key={detailKey}>
                <span className="FeedContent__label">{I18n.t(attributeLabels[detailKey])}:</span>
                <span className="FeedContent__value-to">{prepareValue(detailKey, value)}</span>
              </div>,
            );

            break;
          }

          case 'CHANGED': {
            acc.push(
              <div key={detailKey}>
                <span className="FeedContent__label">{I18n.t(attributeLabels[detailKey])}:</span>
                <span className="FeedContent__value-from">{prepareValue(detailKey, from)}</span>
                <span className="FeedContent__arrow">&#8594;</span>
                <span className="FeedContent__value-to">{prepareValue(detailKey, to)}</span>
              </div>,
            );

            break;
          }

          case 'REMOVED': {
            acc.push(
              <div key={detailKey}>
                <span className="FeedContent__label">{I18n.t(attributeLabels[detailKey])}:</span>
                <span className="FeedContent__value-from">{prepareValue(detailKey, value)}</span>
                <span className="FeedContent__arrow">&#8594;</span>
                <span className="FeedContent__value-to">&laquo; &raquo;</span>
              </div>,
            );

            break;
          }

          case undefined: {
            this.handleMixedDetails(detailValue, acc);

            break;
          }

          default:
            return null;
        }

        return null;

      // for outdated types
      } if (detailValue) {
        acc.push(
          <div key={detailKey}>
            <span className="FeedContent__label">{I18n.t(attributeLabels[detailKey])}:</span>
            <span className="FeedContent__value-to">{prepareValue(detailKey, detailValue)}</span>
          </div>,
        );
      }

      return null;
    });
  };

  handleNewestDetails = ({ from, to }, acc) => {
    acc.push(
      <div key={`${from} ${to}`}>
        <span className="FeedContent__value-from">{prepareValue(undefined, from)}</span>
        <span className="FeedContent__arrow">&#8594;</span>
        <span className="FeedContent__value-to">{prepareValue(undefined, to)}</span>
      </div>,
    );
  };

  renderContent = () => {
    const { details } = this.props;
    const contentJSX = [];

    this.handleFeedDetails(details, contentJSX);

    return contentJSX;
  };


  render() {
    return (
      <Fragment>
        {this.renderContent()}
      </Fragment>
    );
  }
}

export default FeedContent;
