import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withNotifications } from '../../../../../../components/HighOrder';
import { addTagsMutation } from '../../../../../../graphql/mutations/conditionalTag';
import AddTagsModal from './AddTagsModal';
import { createOrLinkTagMutation } from '../../../../../../graphql/mutations/tag';

export default compose(
  withNotifications,
  graphql(createOrLinkTagMutation, {
    name: 'createOrLinkTag',
  }),
  graphql(addTagsMutation, { name: 'addTags' }),
  connect(({ auth: { playerUUID } }) => ({ playerUUID })),
)(AddTagsModal);
