import React, { PureComponent } from 'react';
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

  handleTypeChanges = () => (
    <div key={uuidv4()} className="FeedContent__changes">
      <span className="FeedContent__arrow">&#8595;</span>
      <span>{I18n.t('COMMON.CHANGES')}</span>
      <span className="FeedContent__arrow">&#8595;</span>
    </div>
  );

  handleTypeAdded = (key, { value }) => {
    if (isObject(value) && !Array.isArray(value)) {
      return (
        <div key={uuidv4()}>
          <span className="FeedContent__label">{renderLabel(key)}:</span>
          <div className="FeedContent__wrapper">
            {Object.entries(value).map(([deepKey, deepValue]) => this.handleTypeAdded(deepKey, { value: deepValue }))}
          </div>
        </div>
      );
    }

    return (
      <div key={uuidv4()}>
        <span className="FeedContent__label">{renderLabel(key)}:</span>
        <span
          className="FeedContent__value-to"
          dangerouslySetInnerHTML={{ __html: prepareValue(key, value) }}
        />
      </div>
    );
  };

  formatTypeChangedElements = (array, type) => array
    .filter(({ changeType }) => changeType === type)
    .map(({ value }) => value)
    .join(', ');

  handleTypeChanged = (key, { from, to, elements }) => {
    if (Array.isArray(elements)) {
      const changeTypeRemoved = this.formatTypeChangedElements(elements, 'REMOVED');
      const changeTypeAdded = this.formatTypeChangedElements(elements, 'ADDED');

      return (
        <div key={uuidv4()}>
          <span className="FeedContent__label">{renderLabel(key)}:</span>
          <span className="FeedContent__value-removed">{changeTypeRemoved}</span>
          <span className="FeedContent__value-comma">
            <If condition={changeTypeRemoved}>
              &#44;&nbsp;
            </If>
          </span>
          <span className="FeedContent__value-added">{changeTypeAdded}</span>
        </div>
      );
    }

    return (
      <div key={uuidv4()}>
        <span className="FeedContent__label">{renderLabel(key)}:</span>
        <span className="FeedContent__value-from">{prepareValue(key, from)}</span>
        <span className="FeedContent__arrow">&#8594;</span>
        <span
          className="FeedContent__value-to"
          dangerouslySetInnerHTML={{ __html: prepareValue(key, to) }}
        />
      </div>
    );
  };

  handleTypeRemoved = (key, { value }) => {
    if (isObject(value)) {
      return Object.entries(value).forEach(([deepKey, deepValue]) => (
        <div key={uuidv4()}>
          <span className="FeedContent__label">{renderLabel(key)}:</span>
          <span
            className="FeedContent__value-to"
            dangerouslySetInnerHTML={{ __html: prepareValue(deepKey, deepValue) }}
          />
          <span className="FeedContent__arrow">&#8594;</span>
          <span className="FeedContent__value-to">&laquo; &raquo;</span>
        </div>
      ));
    }

    return (
      <div key={uuidv4()}>
        <span className="FeedContent__label">{renderLabel(key)}:</span>
        <span className="FeedContent__value-from">{prepareValue(key, value)}</span>
        <span className="FeedContent__arrow">&#8594;</span>
        <span className="FeedContent__value-to">&laquo; &raquo;</span>
      </div>
    );
  };

  handleTypeOutdated = (key, detailValue) => {
    const _detailValue = key === 'amount' ? I18n.toCurrency(detailValue, { unit: '' }) : detailValue;

    return (
      <div key={uuidv4()}>
        <span className="FeedContent__label">{renderLabel(key)}:</span>
        <span
          className="FeedContent__value-to"
          dangerouslySetInnerHTML={{ __html: prepareValue(key, _detailValue) }}
        />
      </div>
    );
  };

  contentTypes = {
    CHANGES: this.handleTypeChanges,
    ADDED: this.handleTypeAdded,
    CHANGED: this.handleTypeChanged,
    REMOVED: this.handleTypeRemoved,
    OUTDATED: this.handleTypeOutdated,
    undefined: (_, deepDetailValue) => this.prepareContent(deepDetailValue),
  };

  prepareContent = (deepDetailValue) => {
    const { details } = this.props;
    const contentJSX = [];

    Object.entries(deepDetailValue || details).forEach(([key, detailValue]) => {
      const { changeType } = detailValue || {};

      if (isObject(detailValue)) {
        if (key === 'changes') {
          contentJSX.push(this.contentTypes.CHANGES());
        }

        contentJSX.push(this.contentTypes[changeType](key, detailValue));

        return null;
      }

      if (detailValue) {
        contentJSX.push(this.contentTypes.OUTDATED(key, detailValue));
      }

      return null;
    });

    return contentJSX;
  }

  render() {
    return this.prepareContent();
  }
}

export default FeedContent;
