import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import List from '../components/List';

const mapStateToProps = ({
  paymentMethodsList: { list: { items: paymentMethods } },
}) => ({
  paymentMethods,
});

const mapActions = {
  loadPaymentMethods: actionCreators.fetchEntities,
  disableLimit: actionCreators.disableLimit,
  enableLimit: actionCreators.enableLimit,
  changeStatus: actionCreators.changeStatus,
  changeLimit: actionCreators.changeLimit,
  getCountryAvailability: actionCreators.getCountryAvailability,
};

export default connect(mapStateToProps, mapActions)(List);
