import { connect } from 'react-redux';
import ViewLayout from '../layouts/ViewLayout';
import { actionCreators } from '../modules/index';

const mapStateToProps = ({ bonusCampaignView, i18n: { locale } }) => ({
  ...bonusCampaignView,
  locale,
});
export default connect(mapStateToProps, {
  ...actionCreators,
})(ViewLayout);
