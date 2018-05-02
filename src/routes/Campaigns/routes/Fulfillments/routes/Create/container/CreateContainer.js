import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators } from '../../../modules';

const mapStateToProps = ({
  options: { data: { currencyCodes, baseCurrency } },
}) => ({
  currencies: currencyCodes,
  baseCurrency,
});

const mapActions = {
  createEntity: actionCreators.createEntity,
};

export default connect(mapStateToProps, mapActions)(Create);
