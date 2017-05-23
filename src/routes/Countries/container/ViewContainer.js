import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import List from '../components/List';

const mapStateToProps = ({
  countriesList: { list },
  i18n: { locale },
}) => ({
  list,
  locale,
});

const mapActions = {
  loadCountries: actionCreators.fetchEntities,
  changeStatus: actionCreators.changeStatus,
};

export default connect(mapStateToProps, mapActions)(List);
