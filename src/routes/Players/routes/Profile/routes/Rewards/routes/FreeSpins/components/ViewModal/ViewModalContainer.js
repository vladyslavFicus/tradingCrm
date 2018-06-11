import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import ViewModal from './ViewModal';
import { freeSpinQuery } from '../../../../../../../../../../graphql/queries/freeSpin';
import { currencyQuery } from '../../../../../../../../../../graphql/queries/options';

export default compose(
  connect(({ auth: { brandId } }) => ({ brandId })),
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: ({ brandId }) => ({
      variables: {
        brandId,
      },
    }),
    skip: ({ brandId }) => !brandId,
  }),
  graphql(freeSpinQuery, {
    options: ({ playerUUID, uuid }) => ({
      variables: {
        playerUUID,
        uuid,
      },
    }),
    name: 'freeSpin',
    skip: ({ loading }) => loading,
  }),
)(ViewModal);
