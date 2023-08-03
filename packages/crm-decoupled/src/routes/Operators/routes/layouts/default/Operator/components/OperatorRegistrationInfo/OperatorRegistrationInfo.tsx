import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import './OperatorRegistrationInfo.scss';

type Props = {
  registrationDate: string,
};

const OperatorRegistrationInfo = (props: Props) => {
  const { registrationDate } = props;

  return (
    <div className="OperatorRegistrationInfo">
      <div className="OperatorRegistrationInfo__title">
        {I18n.t('COMMON.REGISTERED')}
      </div>

      <If condition={!!registrationDate}>
        <div className="OperatorRegistrationInfo__general">
          {moment.utc(registrationDate).local().fromNow()}
        </div>

        <div className="OperatorRegistrationInfo__additional">
          {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
      </If>
    </div>
  );
};

export default React.memo(OperatorRegistrationInfo);
