import React, { useState } from 'react';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import Placeholder from 'components/Placeholder';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { PaymentsQuery, PaymentsQueryVariables } from '../../graphql/__generated__/PaymentsQuery';
import {
  usePaymentsTotalCountQueryLazyQuery,
} from './graphql/__generated__/PaymentsTotalCountQuery';
import './PaymentsHeader.scss';

const MAX_QUERY_PAYMENTS = 107;

type Props = {
  totalElements?: number,
  partnersLoading?: boolean,
  paymentsQuery: QueryResult<PaymentsQuery>,
}

const PaymentsHeader = (props: Props) => {
  const {
    totalElements = 0,
    partnersLoading,
    paymentsQuery: {
      variables = {},
    },
  } = props;
  const [loadingTotalCount, setLoadingTotalCount] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // ===== Requests ===== //
  const [paymentsTotalCountQuery] = usePaymentsTotalCountQueryLazyQuery({
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: { batch: false },
  });

  // ===== Handlers ===== //
  const handleGetPaymentsCount = async () => {
    try {
      const { data: totalCountData } = await paymentsTotalCountQuery({
        variables: variables as PaymentsQueryVariables,
      });

      if (totalCountData?.paymentsTotalCount) {
        setTotalCount(totalCountData?.paymentsTotalCount);
      }
    } catch (e) {
      // Do nothing...
    }

    setLoadingTotalCount(false);
  };

  return (
    <div className="PaymentHeader">
      <Placeholder
        ready={!partnersLoading}
        rows={[{ width: 220, height: 20 }]}
      >
        <Choose>
          <When condition={!!totalElements}>
            <span className="PaymentHeader__title">
              <Choose>
                <When condition={totalElements === MAX_QUERY_PAYMENTS && !totalCount}>
                  <>
                    <Placeholder
                      ready={!loadingTotalCount}
                      rows={[{ width: 75, height: 20 }]}
                    >
                      <span
                        className="PaymentHeader__active-text"
                        onClick={handleGetPaymentsCount}
                        id="paymentsTotalCount"
                      >
                        {`${totalElements} +`}
                      </span>
                    </Placeholder>

                    <If condition={!loadingTotalCount}>
                      <UncontrolledTooltip
                        placement="bottom-start"
                        target="paymentsTotalCount"
                        delay={{ show: 350, hide: 250 }}
                        fade={false}
                      >
                        {I18n.t('CLIENTS.TOTAL_COUNT_TOOLTIP')}
                      </UncontrolledTooltip>
                    </If>

                    &nbsp;{I18n.t('COMMON.PAYMENTS')}
                  </>
                </When>

                <When condition={totalElements === MAX_QUERY_PAYMENTS && !!totalCount}>
                  <b>{totalElements} </b> {I18n.t('COMMON.PAYMENTS')}
                </When>

                <Otherwise>
                  <b>{totalElements} </b> {I18n.t('COMMON.PAYMENTS')}
                </Otherwise>
              </Choose>
            </span>
          </When>

          <Otherwise>
            <span className="PaymentHeader__title">
              {I18n.t('COMMON.PAYMENTS')}
            </span>
          </Otherwise>
        </Choose>
      </Placeholder>
    </div>
  );
};

export default React.memo(PaymentsHeader);
