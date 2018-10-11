import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withModals } from '@newage/react-hoc';
import { createQueryPagination } from '@newage/casino_backoffice_utils';
import { conditionalTagsQuery } from '.././../../../../graphql/queries/conditionalTags';
import ConditionalTagsList from '../components/ConditionalTagsList';
import AddTagsModal from '../components/AddTagsModal';
import { disableTagMutation } from '.././../../../../graphql/mutations/conditionalTag';

export default compose(
  connect(({ i18n: { locale } }) => ({ locale })),
  withModals({
    addTags: AddTagsModal,
  }),
  graphql(conditionalTagsQuery, {
    name: 'conditionalTags',
    options: ({ location: { query } }) => ({
      fetchPolicy: 'network-only',
      variables: {
        ...query ? query.filters : {},
        size: 25,
        page: 0,
      },
    }),
    props: ({ conditionalTags: { conditionalTags, fetchMore, ...rest } }) => ({
      conditionalTags: {
        ...rest,
        conditionalTags,
        loadMoreTags: () => {
          const data = conditionalTags && conditionalTags.data ? conditionalTags.data : {};
          createQueryPagination(fetchMore, { page: data.number + 1, size: 25 }, 'conditionalTags.data');
        },
      },
    }),
  }),
  graphql(disableTagMutation, {
    name: 'disableTag',
  }),
)(ConditionalTagsList);
