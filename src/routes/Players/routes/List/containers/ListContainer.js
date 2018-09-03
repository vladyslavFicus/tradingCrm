import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import List from '../components/List';
import countries from '../../../../../utils/countryList';

const mapStateToProps = ({
  usersList: list,
  i18n: { locale },
  options: { data: { currencyCodes } },
  auth: { brandId, uuid },
}) => ({
  list,
  locale,
  currencies: currencyCodes,
  countries,
  auth: { brandId, uuid },
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
