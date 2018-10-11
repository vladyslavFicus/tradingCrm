import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import AddTagsModal from './AddTagsModal';

export default compose(
  connect(({ auth: { playerUUID } }) => ({ playerUUID })),
)(AddTagsModal);
