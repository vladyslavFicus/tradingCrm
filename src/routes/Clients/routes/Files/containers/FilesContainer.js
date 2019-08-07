import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { fileListQuery } from 'graphql/queries/files';
import Files from '../components/Files';

export default compose(
  graphql(fileListQuery, {
    name: 'fileList',
    options: ({
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        page: 0,
        size: 20,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ fileList: { fileList, fetchMore, ...rest } }) => {
      const newPage = get(fileList, 'number', 0);

      return {
        fileList: {
          ...rest,
          fileList,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.fileList.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  fileList: {
                    ...previousResult.fileList,
                    ...fetchMoreResult.fileList,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                fileList: {
                  ...previousResult.fileList,
                  ...fetchMoreResult.fileList,
                  content: [
                    ...previousResult.fileList.content,
                    ...fetchMoreResult.fileList.content,
                  ],
                },
              };
            },
          }),
        },
      };
    },
  }),
)(Files);
