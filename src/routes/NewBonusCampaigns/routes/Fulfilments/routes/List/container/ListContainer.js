import { connect } from 'react-redux';
import List from '../components/List';
import { actionCreators } from '../../../modules';

const mapStateToProps = ({
  wageringFulfilments,
  i18n: { locale },
}) => ({
  locale,
  wageringFulfilments,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  deleteEntity: actionCreators.deleteEntity,
};

export default connect(mapStateToProps, mapActions)(List);
