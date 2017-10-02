import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import renderLabel from '../../utils/renderLabel';
import { countries } from '../../config/countries';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

const IpFlag = ({ id, country, ip }) => (
  <span>
    <i id={id} className={`fs-icon fs-${country.toLowerCase()}`} />
    <UncontrolledTooltip
      placement="top"
      target={id}
      delay={{
        show: 350,
        hide: 250,
      }}
    >
      {
        (country && ip)
          ? <span>{`
          ${(country && !ip) ? `${renderLabel(country, countries)}` : ''}
          ${(country && ip) ? `${renderLabel(country, countries)} - ${ip}` : ''}
          ${(ip && !country) ? `${ip}` : ''}
          `}</span>
          : I18n.t('COMMON.UNAVAILABLE')
      }
    </UncontrolledTooltip>
  </span>
);

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
