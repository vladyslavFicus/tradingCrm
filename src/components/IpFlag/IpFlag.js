import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import countryList from 'country-list';
import Flag from 'react-country-flag';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

class IpFlag extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    country: PropTypes.string,
    ip: PropTypes.string,
  };

  static defaultProps = {
    country: null,
    ip: null,
  };

  render() {
    const { id, ip, country } = this.props;
    const countryName = country ? countryList().getName(country) : null;
    const tooltipContent = [countryName, ip].filter(i => i).join(' - ');

    return (
      <span>
        <Flag svg id={`ipflag-${id}`} countryCode={country} />
        <UncontrolledTooltip
          placement="top"
          target={`ipflag-${id}`}
          fade={false}
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
  }
}

export default IpFlag;
