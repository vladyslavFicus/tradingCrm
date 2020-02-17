import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import Flag from 'react-world-flags';
import languageNames from 'constants/languageNames';
import { getCountryCode } from 'utils/countryList';
import './CountryLabelWithFlag.scss';

class CountryLabelWithFlag extends PureComponent {
  static propTypes = {
    languageCode: PropTypes.string,
    code: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    languageCode: null,
    width: 20,
  };

  getLanguage = (languageCode) => {
    const lang = languageNames.find(item => item.languageCode === languageCode);
    return lang ? I18n.t(lang.languageName) : I18n.t('COMMON.LANGUAGE_NAME.EN');
  }

  render() {
    const { height, width, code, languageCode } = this.props;

    return (
      <div className="CountryLabelWithFlag">
        <div className="CountryLabelWithFlag__flag">
          <Flag height={height} width={width} code={getCountryCode(code)} />
        </div>
        <div className="CountryLabelWithFlag__codes">
          <div className="CountryLabelWithFlag__country-code">{code}</div>
          <If condition={languageCode}>
            <div className="CountryLabelWithFlag__language-code">{this.getLanguage(languageCode)}</div>
          </If>
        </div>
      </div>
    );
  }
}

export default CountryLabelWithFlag;
