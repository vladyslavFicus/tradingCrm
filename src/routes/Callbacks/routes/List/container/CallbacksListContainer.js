import { connect } from 'react-redux';
import { actionCreators as callbacksActionCreators } from '../modules/index';
import CallbacksList from '../components/CallbacksList';

const mapActionCreators = {
  fetchEntities: callbacksActionCreators.fetchEntities,
  exportEntities: callbacksActionCreators.exportEntities,
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
