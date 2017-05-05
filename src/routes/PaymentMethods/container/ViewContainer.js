import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import List from '../components/List';

const mapStateToProps = ({
  paymentMethodsList: { list: { items: paymentMethods } },
  i18n: { locale },
}) => ({
  paymentMethods,
  locale,
});

const mapActions = {
  loadPaymentMethods: actionCreators.fetchEntities,
  disableLimit: actionCreators.disableLimit,
  enableLimit: actionCreators.enableLimit,
  changeStatus: actionCreators.changeStatus,
  changeLimit: actionCreators.changeLimit,
  getCountryAvailability: actionCreators.getCountryAvailability,
  changePaymentMethodOrder: actionCreators.changePaymentMethodOrder,
};

export default connect(mapStateToProps, mapActions)(List);
