import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { filesQuery } from 'graphql/queries/files';
import { verifyMutation, refuseMutation, deleteMutation, updateFileStatusMutation } from 'graphql/mutations/files';
import Files from '../components/Files';
import { actionCreators as filesActionCreators } from '../../../modules/files';

const mapDispathToProps = {
  downloadFile: filesActionCreators.downloadFile,
};

export default compose(
  connect(null, mapDispathToProps),
  graphql(verifyMutation, {
    name: 'verify',
  }),
  graphql(refuseMutation, {
    name: 'refuse',
  }),
  graphql(deleteMutation, {
    name: 'delete',
    options: ({
      match: { params: { id: playerUUID } },
    }) => ({
      variables: { playerUUID },
    }),
  }),
  graphql(updateFileStatusMutation, {
    name: 'updateFileStatus',
  }),
  graphql(filesQuery, {
    name: 'files',
    options: ({
      match: { params: { id: playerUUID } },
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        playerUUID,
        page: 0,
        size: 20,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ files: { files, fetchMore, ...rest } }) => {
      const newPage = get(files, 'number', 0);

      return {
        files: {
          ...rest,
          files,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.files.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  files: {
                    ...previousResult.files,
                    ...fetchMoreResult.files,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                files: {
                  ...previousResult.files,
                  ...fetchMoreResult.files,
                  content: [
                    ...previousResult.files.content,
                    ...fetchMoreResult.files.content,
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
