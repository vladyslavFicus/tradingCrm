import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { getFilesList, getFilesCategoriesList } from 'graphql/queries/files';
import Files from '../components/Files';

export default compose(
  graphql(getFilesCategoriesList, { name: 'getFilesCategoriesList' }),
  graphql(getFilesList, {
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
    props: ({ fileList: { fileList, fetchMore, ...rest }, ownProps: { location: { query } } }) => {
      const newPage = get(fileList, 'number', 0);

      return {
        fileList: {
          ...rest,
          fileList,
          loadMore: () => fetchMore({
            variables: {
              ...query && query.filters,
              page: newPage + 1,
              size: 20,
            },
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
                  data: {
                    ...previousResult.fileList.data,
                    ...fetchMoreResult.fileList.data,
                    content: [
                      ...previousResult.fileList.data.content,
                      ...fetchMoreResult.fileList.data.content,
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
)(Files);
