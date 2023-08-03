import React from 'react';
import I18n from 'i18n-js';
import ReactSwitch from 'components/ReactSwitch';
import useAffiliateSettings from 'routes/Clients/routes/Client/routes/ClientProfileTab/hooks/useAffiliateSettings';
import './AffiliateSettings.scss';

type Props = {
  profileUuid: string,
  showFtdToAffiliate: boolean,
};

const AffiliateSettings = (_props: Props) => {
  const {
    showFtdToAffiliate,
    isToggleDisabled,
    handleDisableShowFTD,
    handleEnableShowFTD,
    notifyErrorSwitch,
  } = useAffiliateSettings(_props);

  return (
    <div className="AffiliateSettings">
      <div className="AffiliateSettings__title">
        {I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.TITLE')}
      </div>

      <ReactSwitch
        on={showFtdToAffiliate}
        stopPropagation
        disabled={isToggleDisabled()}
        className="AffiliateSettings__switcher"
        data-testid="AffiliateSettings-ftdToAffiliateSwitch"
        label={I18n.t('PLAYER_PROFILE.PROFILE.AFFILIATE_SETTINGS.FTD_TO_AFFILIATE_TOGGLE.LABEL')}
        labelPosition="right"
        onClick={showFtdToAffiliate ? handleDisableShowFTD : handleEnableShowFTD}
        onError={notifyErrorSwitch}
      />
    </div>
  );
};

export default React.memo(AffiliateSettings);
