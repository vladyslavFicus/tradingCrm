import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import { withNotifications } from 'hoc';
import { updatePartner } from 'graphql/mutations/partners';
import { partnerQuery } from 'graphql/queries/partners';
import { withStorage } from 'providers/StorageProvider';
import Edit from '../components/Edit';

export default compose(
  withStorage(['auth', 'brand']),
  withNotifications,
  graphql(updatePartner, {
    name: 'updateProfile',
  }),
  graphql(partnerQuery, {
    options: ({ match: { params: { id } } }) => ({
      variables: { uuid: id },
    }),
    props: ({ data: { partner } }) => {
      const { authorities, permission, ...partnerProfile } = get(partner, 'data', {});

      return {
        authorities: authorities || [],
        allowedIpAddresses: get(permission, 'allowedIpAddresses') || [],
        forbiddenCountries: get(permission, 'forbiddenCountries') || [],
        showNotes: get(permission, 'showNotes') || false,
        showSalesStatus: get(permission, 'showSalesStatus') || false,
        showFTDAmount: get(permission, 'showFTDAmount') || false,
        showKycStatus: get(permission, 'showKycStatus') || false,
        profile: {
          data: {
            ...partnerProfile,
          },
        },
      };
    },
  }),
)(Edit);
