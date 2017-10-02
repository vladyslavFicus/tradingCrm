import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import renderLabel from '../../utils/renderLabel';
import { countries } from '../../config/countries';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

const IpFlag = ({ id, country, ip }) => {
  const tooltipContent = _.without([renderLabel(country, countries), ip], null).join(' - ');

  return (
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
          (!country && !ip)
            ? I18n.t('COMMON.UNAVAILABLE')
            : <span>{tooltipContent}</span>
        }
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
