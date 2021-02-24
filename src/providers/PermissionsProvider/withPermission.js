import React from 'react';
import PropTypes from 'prop-types';
import { PermissionConsumer, PermissionPropTypes } from './PermissionProvider';

const withPermission = Component => (
  props => (
    <PermissionConsumer>
      {({ permission }) => (
        <Component {...props} permission={permission} />
      )}
    </PermissionConsumer>
  )
);

withPermission.propTypes = {
  permission: PropTypes.shape(PermissionPropTypes).isRequired,
};

export default withPermission;
