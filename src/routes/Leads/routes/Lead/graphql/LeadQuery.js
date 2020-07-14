import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query LeadProfileQuery(
    $uuid: String!
  ) {
    lead (
      uuid: $uuid
    ) {
      _id
      affiliate
      brandId
      birthDate
      city
      country
      email
      gender
      language
      migrationId
      mobile
      name
      phone
      registrationDate
      salesAgent {
        fullName
        hierarchy {
          parentBranches {
            branchType
            name
            parentBranch {
              branchType
              name
            }
          }
        }
        uuid
      }
      salesStatus
      source
      status
      statusChangedDate
      surname
      uuid
    }
  }
`;

const LeadProfileQuery = ({
  match: { params: { id } },
  children,
}) => (
  <Query query={REQUEST} variables={{ uuid: id }} fetchPolicy="network-only">
    {children}
  </Query>
);

LeadProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default LeadProfileQuery;
