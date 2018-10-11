import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Limits from '../components/Limits';
import { actionCreators } from '../modules';
import { getLimitPeriods } from '../../../../../../../config';
import { realBaseCurrencyQuery } from '.././../../../../../../graphql/queries/profile';

const configLimitPeriods = getLimitPeriods();

const limitPeriods = Object
  .keys(configLimitPeriods)
  .reduce((result, period) => ({
    ...result,
    [period]: configLimitPeriods[period].periods || [],
  }), {});

const mapStateToProps = ({
  userLimits: {
    view,
    regulation: {
      list: regulation,
    },
  },
  i18n: { locale },
}) => ({
  ...view,
  regulation,
  locale,
  limitPeriods,
});

const mapActions = {
  cancelLimit: actionCreators.cancelLimit,
  fetchEntities: actionCreators.fetchLimits,
  fetchRegulation: actionCreators.fetchRegulationLimit,
  setLimit: actionCreators.setLimit,
};

export default compose(
  connect(mapStateToProps, mapActions),
  graphql(realBaseCurrencyQuery, {
    options: ({ match: { params: { id: playerUUID } } }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'realBaseCurrency',
  }),
)(Limits);
