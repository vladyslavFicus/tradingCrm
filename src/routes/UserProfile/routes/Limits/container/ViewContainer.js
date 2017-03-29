import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { getLimitPeriods } from '../../../../../config/index';

const configLimitPeriods = getLimitPeriods();

const limitPeriods = Object
  .keys(configLimitPeriods)
  .reduce((result, period) => {
    result[period] = configLimitPeriods[period].periods;
    return result;
  }, {});

const mapStateToProps = ({ userLimits: { view } }) => ({
  ...view,
  limitPeriods,
});

const mapActions = {
  cancelLimit: actionCreators.cancelLimit,
  fetchEntities: actionCreators.fetchLimits,
  setLimit: actionCreators.setLimit,
  fetchNotes: actionCreators.fetchNotes,
  addNote: actionCreators.addNote,
  editNote: actionCreators.editNote,
  deleteNote: actionCreators.deleteNote,
};

export default connect(mapStateToProps, mapActions)(View);
