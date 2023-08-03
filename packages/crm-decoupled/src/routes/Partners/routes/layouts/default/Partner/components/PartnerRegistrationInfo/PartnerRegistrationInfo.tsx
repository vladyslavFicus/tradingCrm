import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import './PartnerRegistrationInfo.scss';

type Props = {
  createdAt: string,
};

const PartnerRegistrationInfo = (props: Props) => {
  const { createdAt } = props;

  return (
    <div className="PartnerRegistrationInfo">
      <div className="PartnerRegistrationInfo__title">
        {I18n.t('COMMON.REGISTERED')}
      </div>

      <If condition={!!createdAt}>
        <div className="PartnerRegistrationInfo__general">
          {moment.utc(createdAt).local().fromNow()}
        </div>

        <div className="PartnerRegistrationInfo__additional">
          {I18n.t('COMMON.ON')} {moment.utc(createdAt).local().format('DD.MM.YYYY HH:mm')}
        </div>
      </If>
    </div>
  );
};

export default React.memo(PartnerRegistrationInfo);
