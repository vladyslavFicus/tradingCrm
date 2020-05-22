import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import Flag from 'react-world-flags';
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
            <div className="CountryLabelWithFlag__language-code">
              {I18n.t(`COMMON.LANGUAGE_NAME.${languageCode.toUpperCase()}`, {
                defaultValue: languageCode.toUpperCase(),
              })}
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default CountryLabelWithFlag;
