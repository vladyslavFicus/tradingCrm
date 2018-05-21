import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import List from '../components/List';
import { statuses } from '../../../../../constants/bonus-campaigns';

const mapStateToProps = ({
  bonusCampaigns,
  i18n: { locale },
  options: { data: { currencyCodes } },
}) => ({
  ...bonusCampaigns,
  locale,
  statuses: Object.keys(statuses),
  currencies: currencyCodes,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  createCampaign: actionCreators.createCampaign,
  exportEntities: actionCreators.exportEntities,
  fetchTypes: actionCreators.fetchTypes,
  resetAll: actionCreators.resetAll,
  fetchDepositNumbers: actionCreators.fetchDepositNumbers,
};

export default connect(mapStateToProps, mapActions)(List);

