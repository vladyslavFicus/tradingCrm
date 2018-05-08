import { connect } from 'react-redux';
import List from '../components/List';
import { actionCreators } from '../../../modules';

const mapStateToProps = ({
  wageringFulfillments,
  i18n: { locale },
}) => ({
  locale,
  wageringFulfillments,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  deleteEntity: actionCreators.deleteEntity,
};

export default connect(mapStateToProps, mapActions)(List);
