import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { getClientPayments } from '../../../../../graphql/queries/payments';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import PaymentsGrid from './PaymentsGrid';

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
  graphql(getClientPayments, {
    name: 'clientPayments',
    options: variables => ({ variables }),
  }),
)(PaymentsGrid);
