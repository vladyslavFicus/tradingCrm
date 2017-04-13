import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = ({ userPaymentAccounts: { list: { items: paymentAccounts } } }) => ({
  paymentAccounts,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
};

export default connect(mapStateToProps, mapActions)(View);
