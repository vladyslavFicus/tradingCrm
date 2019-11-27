import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import { reduxForm, formValueSelector } from 'redux-form';
import { paymentsStatisticQuery } from 'graphql/queries/statistics';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { formName, initialQueryParams } from './constants';
import Balances from './Balances';

const selector = formValueSelector(formName);

const reduxFormConfig = reduxForm({
  form: formName,
  initialValues: {
    date: moment().subtract(7, 'days').format(),
  },
});

const mapStateToProps = state => ({
  selectValue: selector(state, 'date'),
});

export default compose(
  connect(mapStateToProps),
  reduxFormConfig,
  graphql(paymentsStatisticQuery, {
    options: ({ uuid }) => ({
      variables: {
        playerUUID: uuid,
        ...initialQueryParams(tradingTypes.DEPOSIT, tradingStatuses.MT4_COMPLETED),
      },
    }),
    name: 'depositPaymentStatistic',
  }),
  graphql(paymentsStatisticQuery, {
    options: ({ uuid }) => ({
      variables: {
        playerUUID: uuid,
        ...initialQueryParams(tradingTypes.WITHDRAW, tradingStatuses.MT4_COMPLETED),
      },
    }),
    name: 'withdrawPaymentStatistic',
  }),
)(Balances);
