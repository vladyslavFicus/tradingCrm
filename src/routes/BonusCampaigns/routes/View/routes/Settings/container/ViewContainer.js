import { connect } from 'react-redux';
import View from '../components/View';
import config from '../../../../../../../config/index';
import { actionCreators } from '../../../modules';

const mapStateToProps = ({ bonusCampaignView: { data }, i18n: { locale } }) => ({
  bonusCampaign: data,
  currencies: config.nas.currencies.supported || [],
  locale,
});

const mapActions = {
  updateCampaign: actionCreators.updateCampaign,
};

export default connect(mapStateToProps, mapActions)(View);
