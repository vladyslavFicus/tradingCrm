import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import './GridEmptyValue.scss';

class GridEmptyValue extends PureComponent {
  render() {
    return (
      <span className="GridEmptyValue">{I18n.t('COMMON.NONE')}</span>
    );
  }
}

export default GridEmptyValue;
