import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query NotificationCenterUnreadQuery {
    notificationCenterUnread {
      data
    }
  }
`;

const NotificationCenterUnreadQuery = ({ children }) => {
  const [pollActive, setPollActive] = useState(true);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') {
        setPollActive(false);
      } else {
        setPollActive(true);
      }
    }, false);
  }, []);

  return (
    <Query
      query={REQUEST}
      pollInterval={pollActive ? 10000 : 0}
      fetchPolicy="network-only"
    >
      {children}
    </Query>
  );
};

NotificationCenterUnreadQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NotificationCenterUnreadQuery;
