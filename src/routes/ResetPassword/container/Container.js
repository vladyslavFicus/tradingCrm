import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../../../components/SetPassword/View';

export default connect(() => ({}), {
  onSubmit: actionCreators.resetPasswordConfirm,
})(View);
