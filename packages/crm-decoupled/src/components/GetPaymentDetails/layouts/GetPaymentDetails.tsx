import React from 'react';
import I18n from 'i18n-js';
import { LevelType } from 'types';
import CopyToClipboard from 'components/CopyToClipboard';

type Props = {
  details: any,
  type: string,
};

const GetPaymentDetails = (props: Props) => {
  const { type, details: { amount, currency, cryptoDetails } } = props;

  return (
    <>
      {`${I18n.toCurrency(amount, { unit: '' })} ${currency}`}

      <If condition={type === 'WITHDRAWAL' && !!cryptoDetails}>
        {` (${cryptoDetails.network}, ${cryptoDetails.network} - `}

        <CopyToClipboard
          text={`${cryptoDetails.tokenContractAddress}`}
          withNotification
          notificationLevel={LevelType.INFO}
          notificationTitle="COMMON.NOTIFICATIONS.COPIED"
          notificationMessage="COMMON.NOTIFICATIONS.COPY_CONTRACT_ADDRESS"
        >
          <span>{`${cryptoDetails.tokenContractAddress}`}</span>
        </CopyToClipboard>

        )
      </If>
    </>
  );
};

export default React.memo(GetPaymentDetails);
