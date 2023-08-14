import React from 'react';
import I18n from 'i18n-js';
import { Types } from '@crm/common';
import CopyToClipboard from 'components/CopyToClipboard';
import './GetPaymentDetails.scss';

type Props = {
  details: any,
  type: string,
};

const WITHDRAWAL_DETAILS_KEYS = [
  'withdrawalType',
  'network',
  'token',
  'tokenContractAddress',
  'iban',
];

const GetPaymentDetails = (props: Props) => {
  const { type, details: { amount, currency, withdrawalDetails } } = props;

  const detailsKeys = withdrawalDetails ? WITHDRAWAL_DETAILS_KEYS.filter(key => withdrawalDetails[key]) : [];

  const getValue = (key: string) => (
    <Choose>
      <When condition={['tokenContractAddress', 'iban'].includes(key)}>
        <CopyToClipboard
          text={withdrawalDetails[key]}
          withNotification
          notificationLevel={Types.LevelType.INFO}
          notificationTitle="COMMON.NOTIFICATIONS.COPIED"
          notificationMessage="COMMON.NOTIFICATIONS.CLIPPED_VALUE_MESSAGE"
        >
          <span>{withdrawalDetails[key]}</span>
        </CopyToClipboard>
      </When>

      <Otherwise>
        {withdrawalDetails[key]}
      </Otherwise>
    </Choose>
  );

  return (
    <>
      {`${I18n.toCurrency(amount, { unit: '' })} ${currency}`}

      <If condition={type === 'WITHDRAWAL' && !!detailsKeys.length}>
        <span className="withdrawalDetails">
          ({detailsKeys.map((key, index) => <span key={index}>{index ? ', ' : ''}{getValue(key)}</span>)})
        </span>
      </If>
    </>
  );
};

export default React.memo(GetPaymentDetails);
