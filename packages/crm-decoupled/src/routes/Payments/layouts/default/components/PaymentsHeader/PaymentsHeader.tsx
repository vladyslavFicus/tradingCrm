import React from 'react';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { UncontrolledTooltip } from 'components';
import Placeholder from 'components/Placeholder';
import { PaymentsQuery } from 'routes/Payments/graphql/__generated__/PaymentsQuery';
import { MAX_QUERY_PAYMENTS } from 'routes/Payments/constants/paymentsHeader';
import usePaymentsHeader from 'routes/Payments/hooks/usePaymentsHeader';
import './PaymentsHeader.scss';

type Props = {
  totalElements?: number,
  partnersLoading?: boolean,
  paymentsQuery: QueryResult<PaymentsQuery>,
};

const PaymentsHeader = (props: Props) => {
  const { totalElements, partnersLoading, paymentsQuery } = props;

  const {
    loadingTotalCount,
    totalCount,
    handleGetPaymentsCount,
  } = usePaymentsHeader({ paymentsQuery });

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
                  <b>{totalCount} </b> {I18n.t('COMMON.PAYMENTS')}
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
