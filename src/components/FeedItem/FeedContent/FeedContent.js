import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { isObject } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'constants/propTypes';
import { prepareValue, renderLabel } from './utils';
import './FeedContent.scss';

class FeedContent extends PureComponent {
  static propTypes = {
    details: PropTypes.object.isRequired,
  };

  handleFeedObjDetailAdd = (acc, { value }) => {
    Object.entries(value).forEach(([detailKey, detailValue]) => {
      acc.push(
        <div key={uuidv4()}>
          <span className="FeedContent__label">{I18n.t(renderLabel(detailKey))}:</span>
          <span className="FeedContent__value-to">{prepareValue(detailKey, detailValue)}</span>
        </div>,
      );
    });

    return null;
  };

  handleFeedObjDetailRemove = (acc, { value }) => {
    Object.entries(value).forEach(([detailKey, detailValue]) => {
      acc.push(
        <div key={uuidv4()}>
          <span className="FeedContent__label">{I18n.t(renderLabel(detailKey))}:</span>
          <span className="FeedContent__value-to">{prepareValue(detailKey, detailValue)}</span>
          <span className="FeedContent__arrow">&#8594;</span>
          <span className="FeedContent__value-to">&laquo; &raquo;</span>
        </div>,
      );
    });

    return null;
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
      if (isObject(detailValue)) {
        if (detailKey === 'changes') {
          acc.push(
            <div key={uuidv4()} className="FeedContent__changes">
              <span className="FeedContent__arrow">&#8595;</span>
              <span>{I18n.t('COMMON.CHANGES')}</span>
              <span className="FeedContent__arrow">&#8595;</span>
            </div>,
          );
        }

        const { value, changeType, from, to } = detailValue;

        switch (changeType) {
          case 'ADDED': {
            if (isObject(detailValue.value)) {
              this.handleFeedObjDetailAdd(acc, detailValue);

              break;
            }
            acc.push(
              <div key={uuidv4()}>
                <span className="FeedContent__label">{I18n.t(renderLabel(detailKey))}:</span>
                <span className="FeedContent__value-to">{prepareValue(detailKey, value)}</span>
              </div>,
            );

            break;
          }

          case 'CHANGED': {
            acc.push(
              <div key={uuidv4()}>
                <span className="FeedContent__label">{I18n.t(renderLabel(detailKey))}:</span>
                <span className="FeedContent__value-from">{prepareValue(detailKey, from)}</span>
                <span className="FeedContent__arrow">&#8594;</span>
                <span className="FeedContent__value-to">{prepareValue(detailKey, to)}</span>
              </div>,
            );

            break;
          }

          case 'REMOVED': {
            if (isObject(detailValue.value)) {
              this.handleFeedObjDetailRemove(acc, detailValue);

              break;
            }
            acc.push(
              <div key={uuidv4()}>
                <span className="FeedContent__label">{I18n.t(renderLabel(detailKey))}:</span>
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
          <div key={uuidv4()}>
            <span className="FeedContent__label">{I18n.t(renderLabel(detailKey))}:</span>
            <span className="FeedContent__value-to">{prepareValue(detailKey, detailValue)}</span>
          </div>,
        );
      }

      return null;
    });
  };

  handleNewestDetails = ({ from, to }, acc) => {
    acc.push(
      <div key={uuidv4()}>
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
