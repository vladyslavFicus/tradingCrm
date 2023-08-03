import { useState } from 'react';
import { QueryResult } from '@apollo/client';
import { PaymentsQuery, PaymentsQueryVariables } from '../graphql/__generated__/PaymentsQuery';
import { usePaymentsTotalCountQueryLazyQuery } from '../graphql/__generated__/PaymentsTotalCountQuery';

type Props = {
  paymentsQuery: QueryResult<PaymentsQuery>,
};

const usePaymentsHeader = (props: Props) => {
  const { paymentsQuery: { variables = {} } } = props;

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

  return {
    loadingTotalCount,
    totalCount,
    handleGetPaymentsCount,
  };
};

export default usePaymentsHeader;
