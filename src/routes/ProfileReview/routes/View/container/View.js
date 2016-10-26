import { connect } from 'react-redux';
import { actionCreators } from '../modules/index';
import View from '../components/View';

const mapStateToProps = ({ userReviewView }) => ({
  ...userReviewView,
});

const mapActions = {
  ...actionCreators,
};

export default connect(mapStateToProps, mapActions)(View);
