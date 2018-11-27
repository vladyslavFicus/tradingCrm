import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import countryList from 'country-list';
import classNames from 'classnames';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

const IpFlag = ({ id, country, ip }) => {
  const countryName = country ? countryList().getName(country) : null;
  const tooltipContent = [countryName, ip].filter(i => i).join(' - ');

  return (
    <Fragment>
      <i id={id} className={classNames('fs-icon', { [`fs-${country ? country.toLowerCase() : ''}`]: country })} />
      <UncontrolledTooltip
        placement="top"
        target={id}
        delay={{
          show: 350,
          hide: 250,
        }}
      >
        {
          ip
            ? <span>{tooltipContent}</span>
            : I18n.t('COMMON.UNAVAILABLE')
        }
      </UncontrolledTooltip>
    </Fragment>
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
