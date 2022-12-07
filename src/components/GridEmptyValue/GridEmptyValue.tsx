import React from 'react';
import I18n from 'i18n-js';
import './GridEmptyValue.scss';

const GridEmptyValue = () => (
  <span className="GridEmptyValue">{I18n.t('COMMON.NONE')}</span>
);

export default React.memo(GridEmptyValue);
