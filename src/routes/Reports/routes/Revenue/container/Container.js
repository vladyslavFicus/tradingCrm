import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = ({ revenueReport }) => ({
  ...revenueReport,
});
const mapActions = {
  onDownload: actionCreators.fetchReport,
};
connect(mapStateToProps, mapActions)(View);
