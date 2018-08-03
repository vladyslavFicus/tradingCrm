import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import Flag from 'react-world-flags';
import languageNames from '../../constants/languageNames';
import './GridCountryFlag.scss';

const GridCountryFlag = ({ height, code, languageCode }) => (
  <div className="grid-country-flag">
    <div className="grid-country-flag__icon">
      <Flag height={height} code={code} />
    </div>
    <div className="grid-country-flag__description">
      <div className="font-weight-600">{code}</div>
      <div className="font-size-11">
        {I18n.t(languageNames.find(item => item.languageCode === languageCode).languageName)}
      </div>
    </div>
  </div>
);

GridCountryFlag.propTypes = {
  code: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  languageCode: PropTypes.string.isRequired,
};

export default GridCountryFlag;
