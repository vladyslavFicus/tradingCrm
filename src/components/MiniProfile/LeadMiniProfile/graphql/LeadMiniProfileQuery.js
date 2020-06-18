import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query getLeadMiniProfile($uuid: String!) {
    lead(uuid: $uuid) {
      data {
        _id
        uuid
        name
        phone
        mobile
        country
        surname
        language
        salesStatus
        registrationDate
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
      }
      error {
        error
        fields_errors
      }
    }
  }
`;

const LeadMiniProfileQuery = ({ uuid, children }) => (
  <Query query={REQUEST} variables={{ uuid }} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

LeadMiniProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default LeadMiniProfileQuery;
