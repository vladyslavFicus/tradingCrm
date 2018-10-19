import { connect } from 'react-redux';
import { actionCreators as callbacksActionCreators } from '../modules/index';
import CallbacksList from '../components/CallbacksList';
import { actionCreators as operatorsActionCreators } from '../../../../Operators/routes/List/modules/list';

const mapActionCreators = {
  fetchEntities: callbacksActionCreators.fetchEntities,
  exportEntities: callbacksActionCreators.exportEntities,
  updateEntity: callbacksActionCreators.updateEntity,
  fetchOperators: operatorsActionCreators.fetchEntities,
};
const mapStateToProps = (state) => {
  const {
    auth: {
      token,
      uuid,
    },
    i18n: { locale },
    callbacks,
  } = state;

  return {
    token,
    uuid,
    locale,
    callbacks,
  };
};

export default connect(mapStateToProps, mapActionCreators)(CallbacksList);
