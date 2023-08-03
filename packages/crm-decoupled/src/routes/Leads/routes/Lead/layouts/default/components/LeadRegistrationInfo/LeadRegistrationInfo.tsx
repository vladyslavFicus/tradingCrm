import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import './LeadRegistrationInfo.scss';

type Props = {
  registrationDate: string,
}

const LeadRegistrationInfo = (props: Props) => {
  const { registrationDate } = props;

  return (
    <div className="LeadRegistrationInfo">
      <div className="LeadRegistrationInfo__title">
        {I18n.t('COMMON.REGISTERED')}
      </div>

      <If condition={!!registrationDate}>
        <div className="LeadRegistrationInfo__general">
          {moment.utc(registrationDate).local().fromNow()}
        </div>

        <div className="LeadRegistrationInfo__additional">
          {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
      </If>
    </div>
  );
};

export default React.memo(LeadRegistrationInfo);
