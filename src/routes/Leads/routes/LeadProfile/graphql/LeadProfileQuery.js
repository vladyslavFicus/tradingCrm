import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query LeadProfileQuery(
  $leadId: String!,
) {
  leadProfile (
    leadId: $leadId,
  ) {
    error {
      error
      fields_errors
    }
    data {
      _id
      uuid
      brandId
      name
      surname
      phone
      mobile
      status
      email
      country
      source
      salesAgent {
        fullName
        uuid
        hierarchy {
          parentBranches {
            name
            branchType
            parentBranch {
              name
              branchType
            }
          }
        }
      }
      salesStatus
      birthDate
      affiliate
      gender
      city
      language
      registrationDate
      statusChangedDate
      convertedByOperatorUuid
      convertedToClientUuid
      migrationId
    }
  } 
}`;

const LeadProfileQuery = ({
  match: {
    params: { id: leadId },
  },
  children,
}) => (
  <Query query={REQUEST} variables={{ leadId }} fetchPolicy="network-only">
    {children}
  </Query>
);

LeadProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default LeadProfileQuery;
