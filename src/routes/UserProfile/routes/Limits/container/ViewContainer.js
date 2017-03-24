import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as viewActionCreators } from '../modules/view';

const mapStateToProps = state => ({
  ...state.userLimits,
});

const mapActions = {
  ...viewActionCreators,
};

export default connect(mapStateToProps, mapActions)(View);
