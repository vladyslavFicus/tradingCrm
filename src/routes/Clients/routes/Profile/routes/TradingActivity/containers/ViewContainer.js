import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { tradingActivityQuery } from 'graphql/queries/tradingActivity';
import { withModals } from 'components/HighOrder';
import TradingActivity from '../components/TradingActivity';
import ChangeOriginalAgentModal from '../components/ChangeOriginalAgentModal';

export default compose(
  withModals({
    changeOriginalAgentModal: ChangeOriginalAgentModal,
  }),
  graphql(tradingActivityQuery, {
    name: 'tradingActivity',
    options: ({
      match: {
        params: {
          id: profileUUID,
        },
      },
      location: { query },
    }) => ({
      variables: {
        profileUUID,
        ...(query && query.filters),
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
