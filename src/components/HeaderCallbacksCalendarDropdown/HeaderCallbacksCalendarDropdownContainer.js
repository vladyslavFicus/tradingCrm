import { connect } from 'react-redux';
import HeaderCallbacksCalendarDropdown from './HeaderCallbacksCalendarDropdown';

const mapStateToProps = ({ auth: { uuid: operatorId } }) => ({
  operatorId,
});

export default connect(mapStateToProps)(HeaderCallbacksCalendarDropdown);
