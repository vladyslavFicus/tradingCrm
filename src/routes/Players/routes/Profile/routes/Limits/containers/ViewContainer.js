import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Limits from '../components/Limits';
import { actionCreators } from '../modules';
import { withNotifications } from '../../../../../../../components/HighOrder';
import { getLimitPeriods } from '../../../../../../../config';
import { realBaseCurrencyQuery } from '.././../../../../../../graphql/queries/profile';
import { getPaymentRegulationLimits } from '.././../../../../../../graphql/queries/payments';
import { cancelRegulationLimitMutation } from '.././../../../../../../graphql/mutations/payment';

const configLimitPeriods = getLimitPeriods();

const limitPeriods = Object
  .keys(configLimitPeriods)
  .reduce((result, period) => ({
    ...result,
    [period]: configLimitPeriods[period].periods || [],
  }), {});

const mapStateToProps = ({ userLimits: { view }, i18n: { locale } }) => ({
  ...view,
  locale,
  limitPeriods,
});

const mapActions = {
  cancelLimit: actionCreators.cancelLimit,
  fetchEntities: actionCreators.fetchLimits,
  setLimit: actionCreators.setLimit,
};

export default compose(
  connect(mapStateToProps, mapActions),
  graphql(realBaseCurrencyQuery, {
    options: ({ match: { params: { id: playerUUID } } }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'realBaseCurrency',
  }),
  graphql(getPaymentRegulationLimits, {
    options: ({ match: { params: { id: playerUUID } } }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'paymentRegulationLimits',
  }),
  graphql(cancelRegulationLimitMutation, {
    name: 'cancelRegulationLimitMutation',
  }),
  withNotifications,
)(Limits);
