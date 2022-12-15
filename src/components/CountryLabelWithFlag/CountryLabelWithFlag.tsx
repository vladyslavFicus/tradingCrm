import React from 'react';
import I18n from 'i18n-js';
import Flag from 'react-country-flag';
import { getCountryCode } from 'utils/countryList';
import './CountryLabelWithFlag.scss';

type Props = {
  languageCode?: string,
  code: string,
  height: string,
  width?: string | number,
};

const CountryLabelWithFlag = (props: Props) => {
  const {
    height,
    width = 20,
    code,
    languageCode,
  } = props;

  const countryCode = getCountryCode(code as string) || '';

  return (
    <div className="CountryLabelWithFlag">
      <div className="CountryLabelWithFlag__flag">
        <Choose>
          <When condition={!!countryCode}>
            <Flag
              svg
              style={{
                height,
                width,
              }}
              countryCode={countryCode}
            />
          </When>

          <Otherwise>
            <img src="/img/unknown-country-flag.svg" alt="" />
          </Otherwise>
        </Choose>
      </div>

      <div className="CountryLabelWithFlag__codes">
        <div className="CountryLabelWithFlag__country-code">{code}</div>

        <If condition={!!languageCode}>
          <div className="CountryLabelWithFlag__language-code">
            {I18n.t(`COMMON.LANGUAGE_NAME.${languageCode?.toUpperCase()}`, {
              defaultValue: languageCode?.toUpperCase(),
            })}
          </div>
        </If>
      </div>
    </div>
  );
};

export default React.memo(CountryLabelWithFlag);
