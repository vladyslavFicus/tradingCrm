import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import List from '../components/List';
import config from '../../../../../config';
import countries from '../../../../../utils/countryList';

const mapStateToProps = ({ usersList: list, i18n: { locale } }) => ({
  list,
  locale,
  tags: config.tags || [],
  currencies: config.nas.brand.currencies.supported || [],
  countries,
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
