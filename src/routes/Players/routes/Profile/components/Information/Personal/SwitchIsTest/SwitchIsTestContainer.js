import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { markIsTestMutation } from '../../../../../../../../graphql/mutations/profile';
import { withNotifications } from '../../../../../../../../components/HighOrder';
import { profileQuery } from '../../../../../../../../graphql/queries/profile';
import SwitchIsTest from './SwitchIsTest';

export default compose(
  withRouter,
  graphql(profileQuery, {
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
    name: 'profile',
  }),
  graphql(markIsTestMutation, {
    name: 'markIsTest',
  }),
  withNotifications,
)(SwitchIsTest);
