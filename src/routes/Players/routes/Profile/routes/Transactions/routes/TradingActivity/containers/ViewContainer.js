import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
// import { getFormSyncErrors } from 'redux-form';
import { tradingActivityQuery } from '../../../../../../../../../graphql/queries/tradingActivity';
import TradingActivity from '../components/TradingActivity';
import { currentDateInUnixMs } from '../utils';

const mapStateToProps = ({
  i18n,
}) => ({
  ...i18n,
  // filterErrors: getFormSyncErrors('userTradingActivityFilter')(state),
});

export default compose(
  connect(mapStateToProps),
  graphql(tradingActivityQuery, {
    options: () => ({
      variables: { ...currentDateInUnixMs },
    }),
    name: 'tradingActivity',
  })
)(TradingActivity);
