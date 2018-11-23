import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { clientsQuery } from '../../../../../graphql/queries/profile';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import ClientsGrid from './ClientsGrid';

const mapStateToProps = ({ auth: { brandId, uuid } }) => ({
  auth: {
    brandId,
    uuid,
  },
});

const mapDispatchToProps = {
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(clientsQuery, {
    name: 'profiles',
    options: variables => ({ variables }),
  }),
)(ClientsGrid);
