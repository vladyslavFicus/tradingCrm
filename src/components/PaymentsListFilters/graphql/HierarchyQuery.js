import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query HierarchyQuery {
  hierarchy {
    userBranchHierarchy {
      data {
        DESK {
          name
          uuid
        }
        TEAM {
          name
          uuid
          parentBranch {
            uuid
          }
        }
      }
      error {
        error
      }
    } 
  }
}`;

const HierarchyQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">{children}</Query>
);

HierarchyQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HierarchyQuery;
