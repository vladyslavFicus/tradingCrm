import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { getLimitPeriods } from '../../../../../config';

const configLimitPeriods = getLimitPeriods();

const limitPeriods = Object
  .keys(configLimitPeriods)
  .reduce((result, period) => ({
    ...result,
    [period]: configLimitPeriods[period].periods || [],
  }), {});

const mapStateToProps = ({ userLimits: { view }, i18n: { locale } }) => ({
  ...view,
  locale,
  limitPeriods,
});

const mapActions = {
  cancelLimit: actionCreators.cancelLimit,
  fetchEntities: actionCreators.fetchLimits,
  setLimit: actionCreators.setLimit,
};

export default connect(mapStateToProps, mapActions)(View);
