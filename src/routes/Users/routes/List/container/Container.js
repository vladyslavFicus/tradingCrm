import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({ usersList: list, i18n: { locale } }) => ({
  list,
  locale,
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
