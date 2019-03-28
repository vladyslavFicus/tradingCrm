import React from 'react';
import ShortLoader from 'components/ShortLoader';
// import { I18n } from 'react-redux-i18n';
// import { tradingTypes, statuses, statusMapper } from '../../../constants/payment';
// import { RegistrationChart, DepositsAmount, DepositsCount, WithdrawsAmount, WithdrawsCount } from './Charts';
// import PaymentsGrid from './Grids/PaymentsGrid';
// import ClientsGrid from './Grids/ClientsGrid';
// import './Dashboard.scss';

// const defaultChartProps = {
//   page: 0,
//   limit: 10,
//   statuses: statusMapper[statuses.COMPLETED],
// };

// const options = {
//   DEPOSITS: {
//     paymentTypes: [tradingTypes.DEPOSIT],
//     ...defaultChartProps,
//   },
//   WITHDRAWALS: {
//     paymentTypes: [tradingTypes.WITHDRAW],
//     ...defaultChartProps,
//   },
//   REGISTRATIONS: {
//     size: 10,
//   },
// };

// const Dashboard = () => (
//   <Fragment>
//     <div className="font-size-20 margin-bottom-15">{I18n.t('COMMON.DASHBOARD')}</div>
//     <div className="row chart-row">
//       <div className="col-md-4">
//         <RegistrationChart />
//       </div>
//       <div className="col-md-4">
//         <DepositsAmount />
//       </div>
//       <div className="col-md-4">
//         <DepositsCount />
//       </div>
//       <div className="col-md-4">
//         <WithdrawsAmount />
//       </div>
//       <div className="col-md-4">
//         <WithdrawsCount />
//       </div>
//     </div>

//     {/* Latest deposits */}
//     <div className="font-size-20 margin-bottom-15">
//       {I18n.t('DASHBOARD.LATEST_DEPOSITS', { count: options.DEPOSITS.limit })}
//     </div>
//     <PaymentsGrid {...options.DEPOSITS} />

//     {/* Latest withdrawals */}
//     <div className="font-size-20 margin-bottom-15">
//       {I18n.t('DASHBOARD.LATEST_WITHDRAWALS', { count: options.WITHDRAWALS.limit })}
//     </div>
//     <PaymentsGrid {...options.WITHDRAWALS} />

//     {/* Latest registrations */}
//     <div className="font-size-20 margin-bottom-15">
//       {I18n.t('DASHBOARD.LATEST_REGISTRATIONS', { count: options.REGISTRATIONS.size })}
//     </div>
//     <ClientsGrid {...options.REGISTRATIONS} />
//   </Fragment>
// );

const METABASE_SITE_URL = 'http://metabase.beti.io';

const NewDashboard = React.memo(
  ({ metabaseToken: { loading, getMetabaseToken } }) => (
    /* 128px = 40(top padding) + 40(bot padding) + 48(header height) */
    <Choose>
      <When condition={!loading && getMetabaseToken.token}>
        <div style={{ height: 'calc(100vh - 128px)' }}>
          <iframe
            title="Dashboard"
            src={`${METABASE_SITE_URL}/embed/dashboard/${getMetabaseToken.token}#bordered=true&titled=true`}
            frameBorder={0}
            width="100%"
            height="100%"
            allowtransparency /* eslint-disable-line */
          />
        </div>
      </When>
      <Otherwise>
        <ShortLoader />
      </Otherwise>
    </Choose>
  )
);

export default NewDashboard;
