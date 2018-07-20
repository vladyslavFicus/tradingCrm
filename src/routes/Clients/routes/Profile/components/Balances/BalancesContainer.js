import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import { reduxForm, formValueSelector } from 'redux-form';
import { clientPaymentsStatistic } from '../../../../../../graphql/queries/profile';
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
  graphql(clientPaymentsStatistic, {
    options: ({ playerUUID }) => ({
      variables: {
        playerUUID,
        ...initialQueryParams,
      },
    }),
    name: 'paymentStatistic',
  })
)(Balances);
