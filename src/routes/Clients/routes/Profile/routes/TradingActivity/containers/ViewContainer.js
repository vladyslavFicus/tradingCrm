import { graphql, compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { clientQuery } from 'graphql/queries/profile';
import { operatorsQuery } from 'graphql/queries/operators';
import { tradingActivityQuery } from 'graphql/queries/tradingActivity';
import { withModals } from 'components/HighOrder';
import TradingActivity from '../components/TradingActivity';
import ChangeOriginalAgentModal from '../components/ChangeOriginalAgentModal';

const mapStateToProps = ({
  i18n: { locale },
}) => ({
  locale,
});

export default compose(
  withModals({
    changeOriginalAgentModal: ChangeOriginalAgentModal,
  }),
  withApollo,
  connect(mapStateToProps),
  graphql(operatorsQuery, {
    name: 'operators',
    options: () => ({
      variables: {
        size: 2000,
      },
    }),
  }),
  graphql(clientQuery, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'playerProfile',
  }),
  graphql(tradingActivityQuery, {
    name: 'tradingActivity',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
      location: { query },
    }) => ({
      variables: {
        tradeType: 'LIVE',
        ...query ? query.filters : { playerUUID },
        page: 0,
        limit: 20,
      },
    }),
    props: ({ tradingActivity: { clientTradingActivity, fetchMore, ...rest } }) => {
      const newPage = get(clientTradingActivity, 'data.number') || 0;

      return {
        tradingActivity: {
          ...rest,
          clientTradingActivity,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.clientTradingActivity.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  clientTradingActivity: {
                    ...previousResult.clientTradingActivity,
                    ...fetchMoreResult.clientTradingActivity,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                clientTradingActivity: {
                  ...previousResult.clientTradingActivity,
                  ...fetchMoreResult.clientTradingActivity,
                  data: {
                    ...previousResult.clientTradingActivity.data,
                    ...fetchMoreResult.clientTradingActivity.data,
                    page: fetchMoreResult.clientTradingActivity.data.page,
                    content: [
                      ...previousResult.clientTradingActivity.data.content,
                      ...fetchMoreResult.clientTradingActivity.data.content,
                    ],
                  },
                },
              };
            },
          }),
        },
      };
    },
  }),
)(TradingActivity);
