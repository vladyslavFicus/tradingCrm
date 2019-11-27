import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import countryList from 'country-list';
import classNames from 'classnames';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

const IpFlag = ({ id, country, ip }) => {
  const countryName = country ? countryList().getName(country) : null;
  const tooltipContent = [countryName, ip].filter(i => i).join(' - ');

  return (
    <span>
      <i
        id={`tooltip-${id}`}
        className={classNames('fs-icon', { [`fs-${country ? country.toLowerCase() : ''}`]: country })}
      />
      <UncontrolledTooltip
        placement="top"
        target={`tooltip-${id}`}
        delay={{
          show: 350,
          hide: 250,
        }}
      >
        <Choose>
          <When condition={ip}>
            <span>{tooltipContent}</span>
          </When>
          <Otherwise>
            {I18n.t('COMMON.UNAVAILABLE')}
          </Otherwise>
        </Choose>
      </UncontrolledTooltip>
    </span>
  );
};

IpFlag.propTypes = {
  id: PropTypes.string.isRequired,
  country: PropTypes.string,
  ip: PropTypes.string,
};

IpFlag.defaultProps = {
  country: null,
  ip: null,
};

export default IpFlag;
