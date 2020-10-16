import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query LeadProfileQuery(
  $uuid: String!,
) {
  lead (
    uuid: $uuid,
  ) {
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
    acquisition {
      salesOperator {
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
    }
  }
}`;

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