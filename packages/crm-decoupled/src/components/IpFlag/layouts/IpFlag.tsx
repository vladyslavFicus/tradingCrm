import React from 'react';
import I18n from 'i18n-js';
import Flag from 'react-country-flag';
import useIpFlag from 'components/IpFlag/hooks/useIpFlag';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';

type Props = {
  id: string,
  country: string,
  ip?: string,
}

const IpFlag = (props: Props) => {
  const { id, ip, country } = props;

  const { tooltipContent } = useIpFlag({ ip, country });

  return (
    <>
      <Flag svg id={`ipflag-${id}`} countryCode={country} />

      <UncontrolledTooltip
        placement="top"
        target={`ipflag-${id}`}
        fade={false}
      >
        <Choose>
          <When condition={!!ip}>
            <span>{tooltipContent}</span>
          </When>

          <Otherwise>
            {I18n.t('COMMON.UNAVAILABLE')}
          </Otherwise>
        </Choose>
      </UncontrolledTooltip>
    </>
  );
};

export default React.memo(IpFlag);
