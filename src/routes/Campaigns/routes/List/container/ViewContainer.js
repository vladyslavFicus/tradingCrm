import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { campaignsQuery } from '.././../../../../graphql/queries/campaigns';
import View from '../components/View';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });

export default compose(
  connect(mapStateToProps),
  graphql(campaignsQuery, {
    name: 'campaigns',
  }),
)(View);
