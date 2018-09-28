import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import Flag from 'react-world-flags';
import languageNames from '../../constants/languageNames';
import { getCountryCode } from '../../utils/countryList';
import './CountryLabelWithFlag.scss';

const getLanguage = (languageCode) => {
  const lang = languageNames.find(item => item.languageCode === languageCode);
  return lang ? I18n.t(lang.languageName) : I18n.t('COMMON.LANGUAGE_NAME.EN');
};

const CountryLabelWithFlag = ({ height, width, code, languageCode }) => (
  <div className="grid-country-flag">
    <div className="grid-country-flag__icon">
      <Flag height={height} width={width} code={getCountryCode(code)} />
    </div>
    <div className="grid-country-flag__description">
      <div className="font-weight-600 text-uppercase">{code}</div>
      <div className="font-size-11">
        {getLanguage(languageCode)}
      </div>
    </div>
  </div>
);

CountryLabelWithFlag.propTypes = {
  code: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.string.isRequired,
  languageCode: PropTypes.string.isRequired,
};

CountryLabelWithFlag.defaultProps = {
  width: 20,
};

export default CountryLabelWithFlag;
