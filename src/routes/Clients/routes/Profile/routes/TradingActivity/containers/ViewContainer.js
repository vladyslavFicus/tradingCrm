import { graphql, compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { clientQuery } from 'graphql/queries/profile';
import { tradingActivityQuery } from 'graphql/queries/tradingActivity';
import TradingActivity from '../components/TradingActivity';

const mapStateToProps = ({
  i18n: { locale },
}) => ({
  locale,
});

export default compose(
  withApollo,
  connect(mapStateToProps),
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
