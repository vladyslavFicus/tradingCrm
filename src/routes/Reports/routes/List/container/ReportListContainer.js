import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { createQueryPagination } from '@newage/backoffice_utils';
import ReportList from '../components/ReportList';
import { paymentReportQuery } from '../../../../../graphql/queries/payments';
import getStartDateOfMonth from '../../../../../utils/getStartDateOfMonth';

export default compose(
  connect(({ i18n: { locale } }) => ({ locale })),
  graphql(paymentReportQuery, {
    name: 'paymentReport',
    options: ({ location: { query } }) => ({
      fetchPolicy: 'network-only',
      variables: {
        ...query && query.filters ? query.filters : {
          ...getStartDateOfMonth(),
        },
        size: 20,
        page: 0,
      },
    }),
    props: ({ paymentReport: { paymentReport, fetchMore, ...rest } }) => ({
      paymentReport: {
        ...rest,
        paymentReport,
        loadMoreReports: () => {
          const data = paymentReport && paymentReport.data ? paymentReport.data : {};
          createQueryPagination(fetchMore, { page: data.number + 1, size: 25 }, 'paymentReport.data');
        },
      },
    }),
  }),

)(ReportList);
