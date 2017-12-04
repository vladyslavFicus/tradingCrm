import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import List from '../components/List';

const mapStateToProps = ({ usersList: list, i18n: { locale } }) => ({
  list,
  locale,
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
